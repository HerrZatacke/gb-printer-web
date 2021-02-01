import handleLines from '../handleLines';

const getTransformClassic = (dispatch) => (data, filename) => {

  let dataLines = [];

  // const terminatorLine = '';
  const terminatorLine = '!{"command":"PRNT","sheets":1,"margin_upper":1,"margin_lower":3,"pallet":228,"density":64 }';

  const imagesFromFile = `${data}\n${terminatorLine}`.split('\n')
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
            file: filename ? filename.replace(/.txt$/gi, '') : false,
          } : false;

        default:
          return null;
      }

    })
    .filter(Boolean);

  if (!imagesFromFile.length) {
    console.warn(`File ${filename} did not contain images`);
  }

  dispatch({
    type: 'ADD_TO_QUEUE',
    payload: [...imagesFromFile],
  });
};

export default getTransformClassic;