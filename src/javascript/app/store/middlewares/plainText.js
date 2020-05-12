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
            return {
              type: 'SET_ALL_LINES',
              payload: dataLines.filter(Boolean),
            };

          case 'CLEAR_LINES':
            dataLines = [];
            return null;


          default:
            return null;
        }

      })
      .filter(Boolean)
      .forEach((parsedAction, index) => {
        window.setTimeout(() => {
          store.dispatch(parsedAction);
        }, index * 50);
      });

    return;
  }

  next(action);
};


export default plainText;
