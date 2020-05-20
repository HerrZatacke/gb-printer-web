import handleLines from '../../../tools/handleLines';

const plainText = (store) => (next) => (action) => {
  if (action.type === 'IMPORT_PLAIN_TEXT') {

    let dataLines = [];

    action.payload.split('\n')
      .map(handleLines)
      .filter(Boolean)
      .map((lineAction) => {

        switch (lineAction.type) {
          case 'NEW_LINE':
            dataLines.push(lineAction.payload);
            return null;

          case 'IMAGE_COMPLETE':
            // eslint-disable-next-line no-case-declarations
            const lines = dataLines.filter(Boolean);
            dataLines = [];
            return lines;

          default:
            return null;
        }

      })
      .filter(Boolean)
      .forEach((imageLines, index) => {
        window.setTimeout(() => {
          store.dispatch({
            type: 'SET_ALL_LINES',
            payload: imageLines,
          });
        }, index * 50);
      });

    return;
  }

  next(action);
};


export default plainText;
