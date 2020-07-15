import getHandleFileImport from '../../../tools/getHandleFileImport';
import handleLines from '../../../tools/handleLines';

const plainText = (store) => (next) => (action) => {
  if (action.type === 'IMPORT_FILE') {

    if (action.payload.files && action.payload.files.length === 1) {
      getHandleFileImport(store)(action.payload.files[0]);
    }

    // don't call next(action)
    return;
  }

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

    store.dispatch({
      type: 'ADD_TO_QUEUE',
      payload: [...imagesFromFile],
    });
    return;
  }

  next(action);
};


export default plainText;
