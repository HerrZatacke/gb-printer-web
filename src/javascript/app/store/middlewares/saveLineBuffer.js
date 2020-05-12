import pako from 'pako';

const saveLineBuffer = (store) => (next) => (action) => {

  const lineBuffer = store.getState().lineBuffer;

  if (action.type === 'IMAGE_COMPLETE') {

    const imageData = lineBuffer
      .map((line) => (
        line.replace(/ /gi, '')
      ))
      .join('\n');

    const compressed = pako.deflate(imageData, { to: 'string' });

    // eslint-disable-next-line no-console
    console.log(compressed.length);

    const decompressed = pako.inflate(compressed, { to: 'string' });

    // eslint-disable-next-line no-console
    console.log(decompressed === imageData);
  }

  next(action);
};

export default saveLineBuffer;
