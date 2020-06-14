import transformSav from '../transformSav';

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

    // for now let's assume all .sav files have the same size...
    const dumpText = file.size === 131072 ? transformSav(ev.target.result) : ev.target.result;

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

  if (file.size === 131072) {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }
};

export default getHandleFileImport;
