import {
  parsePackets,
  getImageDataStream,
  decompressDataStream,
  transformToClassic,
} from 'gbp-decode';

const getTransformCapture = (dispatch) => (dumpText, filename) => {

  // const cleanedText = dumpText.replace(/\/\*\(\*\/.*\/\*\)\*\//gi, '');

  const bytes = dumpText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => (
      line.length &&
      line.indexOf('//') !== 0 &&
      line.indexOf('/*') !== 0
    ))
    .map((line) => line.split(' '))
    .flat()
    .map((cc) => parseInt(cc, 16));

  parsePackets(bytes)
    .then(getImageDataStream)
    .then(decompressDataStream)
    .then(transformToClassic)
    .then((data) => {
      dispatch({
        type: 'ADD_TO_QUEUE',
        payload: [{
          file: filename,
          lines: data.split('\n'),
        }],
      });
    });


};

export default getTransformCapture;
