import { ERROR } from '../../app/store/actions';

const getTransformBin = (dispatch) => (data, filename) => {
  const transformed = [];
  let currentLine = [];

  const binOffsetLength = 8;

  try {
    for (let i = binOffsetLength; i < data.length; i += 1) {
      const value = data[i];
      currentLine.push(value.toString(16).padStart(2, '0'));

      if (currentLine.length === 16) {
        transformed.push(currentLine.join(' '));
        currentLine = [];
      }
    }

    // only part of a tile?
    // -> fill the of it in white
    if (currentLine.length) {
      while (currentLine.length < 16) {
        currentLine.push('00');
      }

      transformed.push(currentLine.join(' '));
    }

  } catch (error) {
    dispatch({
      type: ERROR,
      payload: `ERROR_IN_LOADED_BIN\n${filename}`,
    });

    return Promise.resolve([]);
  }

  return Promise.resolve(transformed);
};

export default getTransformBin;
