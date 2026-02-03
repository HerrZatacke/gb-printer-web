import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { NEW_PALETTE_SHORT } from '@/consts/SpecialTags';
import { useStores } from '@/hooks/useStores';
import { useEditStore, useItemsStore } from '@/stores/stores';
import type { Palette } from '@/types/Palette';

interface UseEditPalette {
  canConfirm: boolean,
  canEditShortName: boolean,
  newName: string,
  newShortName: string,
  palette: string[],
  shortName: string,
  setNewName: (newName: string) => void,
  setNewShortName: (newShortName: string) => void,
  setPalette: (palette: string[]) => void,
  save: () => void,
  cancelEditPalette: () => void,
}

export const useEditPalette = (): UseEditPalette => {

  const t = useTranslations('useEditPalette');

  const { editPalette, cancelEditPalette } = useEditStore();
  const { palettes, addPalettes } = useItemsStore();
  const { updateLastSyncLocalNow } = useStores();

  const shortName = editPalette?.shortName || '';
  const statePalette = editPalette?.palette || [];
  const name = editPalette?.name || '';

  const shortNameIsValid = useCallback((pShortName: string) => {
    if (!pShortName.match(/^[a-z]+[a-z0-9]*$/gi)) {
      return false;
    }

    return palettes.findIndex((p) => p.shortName === pShortName) === -1;
  }, [palettes]);

  const canEditShortName = shortName === NEW_PALETTE_SHORT;

  const [newName, setNewName] = useState<string>(name);
  const [palette, setPalette] = useState<string[]>(statePalette);
  const [newShortName, setNewShortName] = useState<string>(canEditShortName ? '' : shortName);

  const canConfirm = useMemo(() => (
    (!canEditShortName || shortNameIsValid(newShortName)) && newName.length > 0
  ), [newName, canEditShortName, newShortName, shortNameIsValid]);

  const save = useCallback(() => {
    const savePalette = (updatedPalette: Palette) => {
      addPalettes([updatedPalette]);
      updateLastSyncLocalNow();
      cancelEditPalette();
    };

    savePalette({
      shortName: canEditShortName ? newShortName : shortName,
      name: newName,
      palette,
      origin: t('paletteOrigin'),
      isPredefined: false,
    });
  }, [
    addPalettes,
    canEditShortName,
    cancelEditPalette,
    newName,
    newShortName,
    palette,
    shortName,
    updateLastSyncLocalNow,
    t,
  ]);

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
    shortName,
    setNewName,
    setNewShortName,
    setPalette,
    save,
    cancelEditPalette,
  };
};
