export const hexToRgbString = (hex: string): string => {
  const cleanHex = hex.replace('#', '');
  if (!/^([0-9a-fA-F]{6})$/.test(cleanHex)) {
    throw new Error('Invalid hex color');
  }

  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};
