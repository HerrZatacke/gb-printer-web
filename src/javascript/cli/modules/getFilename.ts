import type { Args } from './parseArgs';

export const getFilename = (inputName: string, index: number, runOptions: Args) => (
  [
    inputName,
    [...runOptions.channels, runOptions.bracketSize].join(''),
    index.toString(10).padStart(3, '0'),
  ]
    .join('-')
);
