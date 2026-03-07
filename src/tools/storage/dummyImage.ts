import textToTiles from '@/tools/textToTiles';

const dummyImage = (hash: string): string[] => {
  const text = `
The following hash is missing:
${hash}

You may have imported a debug
dump or your browser decided
clean up your local storage.

This image might be able to be
recovered if you have set up
some sort of sync.
`.trim();

  return textToTiles(text);
};

export default dummyImage;
