import textToTiles from '@/tools/textToTiles';

const dummyImage = (hash: string): string[] => {
  const text = `

The following hash is missing:
${hash}

You may have imported a debug
dump or your browser decided
clean up your local storage.

Consider using a storage tool
or create regular backups.
`.trim();

  return textToTiles(text);
};

export default dummyImage;
