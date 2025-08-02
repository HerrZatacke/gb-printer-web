import { useTheme } from '@mui/material/styles';
import { type Theme } from '@mui/system';
import { useTranslations } from 'next-intl';
import React from 'react';
import PaletteIcon from '@/components/PaletteIcon';
import { ActiveFilterUpdateMode } from '@/hooks/useFilterForm';
import { Palette } from '@/types/Palette';

interface Props {
  palette: Palette,
  paletteActive: boolean,
  togglePalette: (mode: ActiveFilterUpdateMode) => void,
}

function FilterFormPalette({ paletteActive, togglePalette, palette }: Props) {
  const t = useTranslations('FilterFormPalette');
  const theme: Theme = useTheme();

  return (
    <button
      title={t(paletteActive ? 'removePalette' : 'selectPalette', { name: palette.name })}
      onClick={() => togglePalette(paletteActive ? ActiveFilterUpdateMode.REMOVE : ActiveFilterUpdateMode.ADD)}
      style={{
        background: paletteActive ? theme.palette.tertiary.main : 'transparent',
      }}
    >
      <PaletteIcon palette={palette.palette} />
    </button>
  );
}

export default FilterFormPalette;
