import getTransformBin from '../transformBin';
import getTransformSav from '../transformSav';
import transformCapture from '../transformCapture';
import getTransformBitmap from '../transformBitmap';
import readFileAs from '../readFileAs';
import transformClassic from '../transformClassic';
import { ADD_TO_QUEUE, CONFIRM_ANSWERED, ERROR, JSON_IMPORT } from '../../app/store/actions';

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

  const onError = (error) => {
    console.error(error);
    dispatch({
      type: ERROR,
      payload: 'FILE_NOT_READ',
    });
  };

  return (files, { fromPrinter } = { fromPrinter: false }) => {

    const groupImports = files.map((fileData) => {
      let file = fileData;
      let contentType = fileData.type;
      let ok = true;

      // As of version 1.16.4 the filedata is an object like { blob, contentType }
      // earlier versions directly provide a blob
      if (fileData.blob) {
        file = fileData.blob;
        contentType = fileData.contentType;
        // v1.16.4 is missing the 'ok' property, hence the explicit check (may be removed in future versions if v0.3.5+ is successful)
        ok = (fileData.ok !== undefined) ? fileData.ok : ok;
      }

      if (!ok || !file.size) {
        console.error('Error in received data', fileData);
        return Promise.resolve([]);
      }

      if (contentType && contentType.startsWith('image/')) {
        transformBitmap(file, fromPrinter);
        return Promise.resolve([]);
      }

      // roughly larger than 256MB is too much....
      if (file.size > 0xfffffff) {
        dispatch({
          type: ERROR,
          payload: 'FILE_TOO_LARGE',
        });
        return Promise.resolve([]);
      }

      if (contentType === 'application/json') {
        readFileAs(file, 'text')
          .catch(onError)
          .then((data) => {
            let settingsDump = {};

            try {
              settingsDump = JSON.parse(data);
            } catch (error) { /**/ }

            if (settingsDump && settingsDump.state) {
              dispatch({
                type: JSON_IMPORT,
                payload: settingsDump,
              });
              return;
            }

            dispatch({
              type: ERROR,
              payload: 'NOT_A_SETTINGS_FILE',
            });
          });
        return Promise.resolve([]);
      }

      if (contentType === 'text/plain') {
        return readFileAs(file, 'text')
          .catch(onError)
          .then((data) => {

            // file must contain something that resembles a gb printer command
            if (data.indexOf('{"command"') === -1) {

              try {
                return transformCapture(data, file.name);
              } catch (error) {
                dispatch({
                  type: ERROR,
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

      // .sav files are always exactly 128kB, but we allow any multiple of 4kB
      if (file.name?.toLowerCase().endsWith('.sav') && file.size % 0x1000 === 0) {
        return readFileAs(file, 'arrayBuffer')
          .catch(onError)
          .then((data) => (
            transformSav(data, file.name)
          ));
      }

      if (
        !contentType ||
        contentType.startsWith('application/')
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
        type: ERROR,
        payload: 'NOT_A_DUMP',
      });
      return Promise.resolve([]);
    });

    Promise.all(groupImports)
      .then((imported) => {
        const toBeConfirmed = imported.flat().filter(Boolean);

        if (toBeConfirmed.length) {
          dispatch({
            type: ADD_TO_QUEUE,
            payload: toBeConfirmed,
          });
        } else {
          store.dispatch({
            type: CONFIRM_ANSWERED,
          });

          // ToDo: use promise returns for all import methods before displaying this message
          // store.dispatch({
          //   type: CONFIRM_ASK,
          //   payload: {
          //     message: 'Nothing found to import',
          //     confirm: () => {
          //       store.dispatch({
          //         type: CONFIRM_ANSWERED,
          //       });
          //     },
          //   },
          // });
        }

      });

  };
};

export default getHandleFileImport;
