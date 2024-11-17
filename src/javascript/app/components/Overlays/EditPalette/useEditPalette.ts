import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useEditStore from '../../../stores/editStore';
import useFiltersStore from '../../../stores/filtersStore';
import useItemsStore from '../../../stores/itemsStore';
import useStoragesStore from '../../../stores/storagesStore';
import type { State } from '../../../store/State';
import type { Palette } from '../../../../../types/Palette';
import getPreviewImages from '../../../../tools/getPreviewImages';
import type { MonochromeImage } from '../../../../../types/Image';
import { NEW_PALETTE_SHORT } from '../../../../consts/SpecialTags';

interface UseEditPalette {
  canConfirm: boolean,
  canEditShortName: boolean,
  newName: string,
  newShortName: string,
  palette: string[],
  previewImages: MonochromeImage[],
  shortName: string,
  setNewName: (newName: string) => void,
  setNewShortName: (newShortName: string) => void,
  setPalette: (palette: string[]) => void,
  save: () => void,
  cancelEditPalette: () => void,
}

export const useEditPalette = (): UseEditPalette => {
  const {
    imageSelection,
    sortBy,
    filtersActiveTags,
    recentImports,
  } = useFiltersStore();

  const { editPalette, cancelEditPalette } = useEditStore();
  const { palettes, addPalettes } = useItemsStore();
  const { setSyncLastUpdate } = useStoragesStore();

  const shortName = editPalette?.shortName || '';
  const statePalette = editPalette?.palette || [];
  const name = editPalette?.name || '';

  const {
    images,
  } = useSelector((state: State) => ({
    images: state.images,
  }));

  const shortNameIsValid = (pShortName: string) => {
    if (!pShortName.match(/^[a-z]+[a-z0-9]*$/gi)) {
      return false;
    }

    return palettes.findIndex((p) => p.shortName === pShortName) === -1;
  };

  const canEditShortName = shortName === NEW_PALETTE_SHORT;

  const [newName, setNewName] = useState<string>(name);
  const [palette, setPalette] = useState<string[]>(statePalette);
  const [newShortName, setNewShortName] = useState<string>(canEditShortName ? '' : shortName);

  const canConfirm = !canEditShortName || shortNameIsValid(newShortName);

  const previewImages = useMemo<MonochromeImage[]>(() => (
    getPreviewImages(images, { sortBy, filtersActiveTags, recentImports }, imageSelection)()
  ), [filtersActiveTags, imageSelection, images, recentImports, sortBy]);

  const savePalette = (updatedPalette: Palette) => {
    addPalettes([updatedPalette]);
    setSyncLastUpdate('local', Math.floor((new Date()).getTime() / 1000));
    cancelEditPalette();
  };

  const save = () => savePalette({
    shortName: canEditShortName ? newShortName : shortName,
    name: newName,
    palette,
    origin: 'Made with the webapp',
    isPredefined: false,
  });

  useEffect(() => {
    const keydownHandler = (ev: KeyboardEvent) => {
      if (ev.key === 'Enter' && ev.ctrlKey && canConfirm) {
        save();
      }
    };

    document.addEventListener('keydown', keydownHandler);
    return () => document.removeEventListener('keydown', keydownHandler);
  });


  return {
    canConfirm,
    canEditShortName,
    newName,
    newShortName,
    palette,
    previewImages,
    shortName,
    setNewName,
    setNewShortName,
    setPalette,
    save,
    cancelEditPalette,
  };
};
