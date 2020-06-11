import handleLines from '../../../tools/handleLines';

const plainText = (store) => {

  const images = [];
  let queueRunning;

  const startQueue = () => {
    if (queueRunning || !images.length) {
      return;
    }

    queueRunning = true;

    window.setTimeout(() => {
      queueRunning = false;
      store.dispatch({
        type: 'SET_ALL_LINES',
        payload: images.shift(),
      });
    }, 50);

    store.dispatch({
      type: 'IMPORT_QUEUE_SIZE',
      payload: images.length - 1,
    });
  };


  return (next) => (action) => {
    if (action.type === 'IMPORT_PLAIN_TEXT') {

      let dataLines = [];

      // const terminatorLine = '';
      const terminatorLine = '!{"command":"PRNT","sheets":1,"margin_upper":1,"margin_lower":3,"pallet":228,"density":64 }';

      const imagesFromFile = `${action.payload}\n${terminatorLine}`.split('\n')
        .map(handleLines)
        .filter(Boolean)
        .map((lineAction) => {

          switch (lineAction.type) {
            case 'NEW_LINES':
              dataLines.push(...lineAction.payload);
              return null;

            case 'IMAGE_COMPLETE':
              // eslint-disable-next-line no-case-declarations
              const lines = dataLines.filter(Boolean);
              dataLines = [];
              return lines.length ? {
                lines,
                file: action.file ? action.file.replace(/.txt$/gi, '') : false,
              } : false;

            default:
              return null;
          }

        })
        .filter(Boolean);

      if (!imagesFromFile.length) {
        console.warn(`File ${action.file} did not contain images`);
      }

      images.push(...imagesFromFile);

      startQueue();
      return;
    }

    next(action);

    if (action.type === 'ADD_IMAGE') {
      startQueue();
    }
  };
};


export default plainText;
