import getTransformBin from '../transformBin';
import getTransformSav from '../transformSav';
import getTransformCapture from '../transformCapture';
import getTransformBitmap from '../transformBitmap';
import readFileAs from '../readFileAs';
import getTransformClassic from '../transformClassic';

// check for the header "GB-BIN01"
const isBinType = (buffer) => (
  buffer[0] === 71 && // G
  buffer[1] === 66 && // B
  buffer[2] === 45 && // -
  buffer[3] === 66 && // B
  buffer[4] === 73 && // I
  buffer[5] === 78 && // N
  buffer[6] === 48 && // 0
  buffer[7] === 49 //    1
);

const getHandleFileImport = (store) => {
  const { dispatch } = store;

  const transformSav = getTransformSav(store);
  const transformBin = getTransformBin(dispatch);
  const transformCapture = getTransformCapture(dispatch);
  const transformBitmap = getTransformBitmap(store);
  const transformClassic = getTransformClassic(dispatch);

  const onError = () => {
    dispatch({
      type: 'ERROR',
      payload: 'FILE_NOT_READ',
    });
  };

  return (file) => {

    if (file.type.startsWith('image/')) {
      transformBitmap(file);
      return;
    }

    // roughly larger than 256MB is too much....
    if (file.size > 0xfffffff) {
      dispatch({
        type: 'ERROR',
        payload: 'FILE_TOO_LARGE',
      });
      return;
    }

    if (file.type === 'application/json') {
      readFileAs(file, 'text')
        .catch(onError)
        .then((data) => {
          let settingsDump = {};

          try {
            settingsDump = JSON.parse(data);
          } catch (error) { /**/ }

          if (settingsDump && settingsDump.state) {
            dispatch({
              type: 'JSON_IMPORT',
              payload: settingsDump,
            });
            return;
          }

          dispatch({
            type: 'ERROR',
            payload: 'NOT_A_SETTINGS_FILE',
          });
        });
      return;
    }

    if (file.type === 'text/plain') {
      readFileAs(file, 'text')
        .catch(onError)
        .then((data) => {

          // file must contain something that resembles a gb printer command
          if (data.indexOf('{"command"') === -1) {

            try {
              transformCapture(data, file.name);
            } catch (error) {
              dispatch({
                type: 'ERROR',
                payload: 'NOT_A_DUMP',
              });
            }

            return;
          }

          transformClassic(data, file.name);
        });
      return;
    }

    if (
      file.type.startsWith('application/') ||
      !file.type
    ) {
      readFileAs(file, 'arrayBuffer')
        .catch(onError)
        .then((data) => {

          if (file.size === 131072) {
            transformSav(data, file.name);
            return;
          }

          if (isBinType(data)) {
            transformBin(data, file.name);
          }
        });
      return;
    }

    dispatch({
      type: 'ERROR',
      payload: 'NOT_A_DUMP',
    });
  };
};

export default getHandleFileImport;
