import transformBin from '../transformBin';
import transformSav from '../transformSav';

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

const getHandleFileImport = (dispatch) => (file) => {

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

    let dumpText;

    const data = Buffer.from(ev.target.result);

    // for now let's assume all .sav files have the same size...
    if (file.size === 131072) {
      dumpText = transformSav(data);
    } else if (isBinType(data)) {
      dumpText = transformBin(data);
    } else {
      dumpText = data.toString('utf8');
    }

    let settingsDump = {};
    try {
      settingsDump = JSON.parse(dumpText);
    } catch (error) {
      /* not a settings file */
    }

    if (settingsDump.state) {
      dispatch({
        type: 'SETTINGS_IMPORT',
        payload: settingsDump,
      });
      return;
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
  };

  reader.readAsArrayBuffer(file);
};

export default getHandleFileImport;
