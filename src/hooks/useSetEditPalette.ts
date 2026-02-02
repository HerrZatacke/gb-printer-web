import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { NEW_PALETTE_SHORT } from '@/consts/SpecialTags';
import { useEditStore, useItemsStore } from '@/stores/stores';
import type { Palette } from '@/types/Palette';

const randomColor = (max: number): string => (
  [
    '#',
    Math.ceil(Math.random() * max).toString(16).padStart(2, '0'),
    Math.ceil(Math.random() * max).toString(16).padStart(2, '0'),
    Math.ceil(Math.random() * max).toString(16).padStart(2, '0'),
  ].join('')
);

const randomPalette = (): Palette => ({
  name: '',
  shortName: NEW_PALETTE_SHORT,
  palette: [
    randomColor(0xff),
    randomColor(0xaa),
    randomColor(0x66),
    randomColor(0x22),
  ],
  origin: '',
  isPredefined: false,
});

interface UseSetEditPalette {
  clonePalette: (shortName: string) => void,
  editPalette: (shortName: string) => void,
}

const useSetEditPalette = (): UseSetEditPalette => {
  const { palettes } = useItemsStore();
  const { setEditPalette } = useEditStore();
  const t = useTranslations('useSetEditPalette');

  const startEditPalette = useCallback((shortName: string, clone: boolean) => {
    const editPalette: Palette = (shortName === NEW_PALETTE_SHORT) ? randomPalette() : (
      palettes.find((palette) => shortName === palette.shortName) || randomPalette()
    );

    setEditPalette({
      ...editPalette,
      name: clone ? t('copyOfPalette', { name: editPalette.name }) : editPalette.name,
      shortName: clone ? NEW_PALETTE_SHORT : shortName,
    });
  }, [palettes, setEditPalette, t]);

  return {
    editPalette: (shortName: string) => startEditPalette(shortName, false),
    clonePalette: (shortName: string) => startEditPalette(shortName, true),
  };
};


export default useSetEditPalette;
