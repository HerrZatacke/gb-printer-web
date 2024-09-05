import type { FrameData } from '../applyFrame/frameData';

const toUpper = (s: string): string => s.toUpperCase();

export const getFrameFromFullTiles = (tiles: string[], imageStartLine: number): FrameData => {

  const upper = tiles.slice(0, imageStartLine * 20).map(toUpper);
  const lower = tiles.slice((imageStartLine + 14) * 20).map(toUpper);
  const left = Array(14).fill(0).map((_, line) => {
    const offsetStart = (line + imageStartLine) * 20;
    return tiles.slice(offsetStart, offsetStart + 2).map(toUpper);
  });
  const right = Array(14).fill(0).map((_, line) => {
    const offsetStart = (line + imageStartLine) * 20;
    return tiles.slice(offsetStart + 18, offsetStart + 20).map(toUpper);
  });

  return {
    upper,
    left,
    right,
    lower,
  };
};
