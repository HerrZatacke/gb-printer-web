import getTransformBin from '../transformBin';
import getTransformSav from '../transformSav';

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

  return (file) => {

    // roughly larger than 1MB is too much....
    if (file.size > 0xfffff) {
      dispatch({
        type: 'ERROR',
        payload: 'FILE_TOO_LARGE',
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (ev) => {

      const data = Buffer.from(ev.target.result);

      if (file.size === 131072) {
        transformSav(data, file.name);
        return;
      }

      if (isBinType(data)) {
        transformBin(data, file.name);
        return;
      }

      Promise.resolve(data.toString('utf8')).then((dumpText) => {

        try {
          const settingsDump = JSON.parse(dumpText);

          if (settingsDump.state) {
            dispatch({
              type: 'SETTINGS_IMPORT',
              payload: settingsDump,
            });
            return;
          }
        } catch (error) {
          /* not a settings file */
        }

        // file must contain something that resembles a gb printer command
        if (dumpText.indexOf('!{"command"') === -1) {
          dispatch({
            type: 'ERROR',
            payload: 'NOT_A_DUMP',
          });
          return;
        }

        dispatch({
          type: 'IMPORT_PLAIN_TEXT',
          payload: dumpText,
          file: file.name,
        });
      });
    };

    reader.readAsArrayBuffer(file);
  };
};

export default getHandleFileImport;
