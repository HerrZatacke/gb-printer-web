import type { Palette, PaletteColor } from '@mui/material/styles/createPalette';

export const getHoverColor = (palette: Partial<Palette> & Pick<Palette, 'mode'>, color: PaletteColor) => (
  color[palette.mode]
);
