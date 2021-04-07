import getTransformBin from '../transformBin';
import getTransformSav from '../transformSav';
import transformCapture from '../transformCapture';
import getTransformBitmap from '../transformBitmap';
import readFileAs from '../readFileAs';
import transformClassic from '../transformClassic';

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
  const transformBitmap = getTransformBitmap(store);

  const onError = () => {
    dispatch({
      type: 'ERROR',
      payload: 'FILE_NOT_READ',
    });
  };

  return (files) => {

    const groupImports = files.map((file) => {

      if (file.type.startsWith('image/')) {
        transformBitmap(file);
        return Promise.resolve([]);
      }

      // roughly larger than 256MB is too much....
      if (file.size > 0xfffffff) {
        dispatch({
          type: 'ERROR',
          payload: 'FILE_TOO_LARGE',
        });
        return Promise.resolve([]);
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
        return Promise.resolve([]);
      }

      if (file.type === 'text/plain') {
        return readFileAs(file, 'text')
          .catch(onError)
          .then((data) => {

            // file must contain something that resembles a gb printer command
            if (data.indexOf('{"command"') === -1) {

              try {
                return transformCapture(data, file.name);
              } catch (error) {
                dispatch({
                  type: 'ERROR',
                  payload: 'NOT_A_DUMP',
                });
                return [];
              }
            }

            return transformClassic(data, file.name);
          })
          .then((imagesLines) => (
            imagesLines.map((lines) => ({
              lines,
              filename: file.name,
            }))
          ));
      }

      // .sav files are always exactly 128kB
      if (file.size === 131072) {
        return readFileAs(file, 'arrayBuffer')
          .catch(onError)
          .then((data) => (
            transformSav(data, file.name)
          ))
          .then((imagesLines) => (
            imagesLines.map((lines) => ({
              lines,
              filename: file.name,
            }))
          ));
      }

      if (
        file.type.startsWith('application/') ||
        !file.type
      ) {
        return readFileAs(file, 'arrayBuffer')
          .catch(onError)
          .then((data) => {

            if (isBinType(data)) {
              return transformBin(data, file.name)
                .then((lines) => ({
                  lines,
                  filename: file.name,
                }));
            }

            return [];
          });
      }

      dispatch({
        type: 'ERROR',
        payload: 'NOT_A_DUMP',
      });
      return Promise.resolve([]);
    });


    Promise.all(groupImports)
      .then((imported) => {
        const toBeConfirmed = imported.flat().filter(Boolean);

        if (toBeConfirmed.length) {
          dispatch({
            type: 'ADD_TO_QUEUE',
            payload: toBeConfirmed,
          });
        }

      });

  };
};

export default getHandleFileImport;
