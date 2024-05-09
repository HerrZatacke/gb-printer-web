import readFileAs, { ReadAs } from '../readFileAs';
import { Actions } from '../../app/store/actions';
import { TypedStore } from '../../app/store/State';
import { JSONExportState } from '../../app/store/middlewares/settings';

const getImportJSON = ({ dispatch }: TypedStore) => async (file: File) => {
  const data = await readFileAs(file, ReadAs.TEXT);
  let settingsDump: Partial<JSONExportState> = {};

  try {
    settingsDump = JSON.parse(data);
  } catch (error) {
    throw new Error('Not a valid .json file');
  }

  if (!settingsDump?.state) {
    throw new Error('Not a settings .json file');
  }

  dispatch({
    type: Actions.JSON_IMPORT,
    payload: settingsDump,
  });

  return true;
};

export default getImportJSON;
