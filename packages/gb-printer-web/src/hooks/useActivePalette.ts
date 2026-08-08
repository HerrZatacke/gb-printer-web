import { type Palette } from 'gb-printer-schemas';
import { missingGreyPalette } from '@/consts/defaults';
import { usePalettes } from '@/hooks/usePalettes';
import { useSettingsStore } from '@/stores/stores';

export const useActivePalette = (): Palette => {
  const { activePalette } = useSettingsStore();
  const { byShortNames: [foundPalette] } = usePalettes({ shortNames: [activePalette] });
  return foundPalette || missingGreyPalette;
};
