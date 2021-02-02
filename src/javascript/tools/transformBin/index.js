const getTransformBin = (dispatch) => (data, filename) => {
  const transformed = [];
  let currentLine = '';

  try {
    // for (let i = 0; i < 16; i += 1) {
    for (let i = 0; i < 5760; i += 1) {
      currentLine += ` ${data[i + 8].toString(16)
        .padStart(2, '0')}`;

      if (i % 16 === 15) {
        transformed.push(currentLine.trim());
        currentLine = '';
      }
    }
  } catch (error) {
    dispatch({
      type: 'ERROR',
      payload: `ERROR_IN_LOADED_BIN\n${filename}`,
    });
    return;
  }

  dispatch({
    type: 'ADD_TO_QUEUE',
    payload: [{
      file: filename,
      lines: transformed,
    }],
  });
};

export default getTransformBin;
