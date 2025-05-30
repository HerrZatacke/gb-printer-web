import textToTiles from '../textToTiles';

const dummyImage = (hash: string): string[] => {
  const text = `
The following hash is missing in
your indexedDb:
${hash}

Either you imported a debug dump
or your browser decided to do a
cleanup.

This image might be able to be
recovered if you have set up git
or dropbox sync.
`.trim();

  return textToTiles(text);
};

export default dummyImage;
