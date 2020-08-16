import {
  parsePackets,
  getImageDataStream,
  decompressDataStream,
  decodePrintCommands,
  harmonizePalettes,
  transformToClassic,
} from 'gbp-decode';

// const lp = (d) => {
//   console.log(d);
//   return d;
// };

const getTransformCapture = (dispatch) => (dumpText, filename) => {

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
    .then(decodePrintCommands)
    .then(harmonizePalettes)
    .then(transformToClassic)
    .then((images) => {

      images.forEach(({ transformed }) => {
        dispatch({
          type: 'ADD_TO_QUEUE',
          payload: [{
            file: filename,
            lines: transformed,
          }],
        });
      });

    });


};

export default getTransformCapture;
