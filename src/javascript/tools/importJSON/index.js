import readFileAs from '../readFileAs';
import { JSON_IMPORT } from '../../app/store/actions';

const getImportJSON = ({ dispatch }) => async (file) => {
  const data = await readFileAs(file, 'text');
  let settingsDump = {};

  try {
    settingsDump = JSON.parse(data);
  } catch (error) {
    throw new Error('Not a valid .json file');
  }

  if (!settingsDump?.state) {
    throw new Error('Not a settings .json file');
  }

  dispatch({
    type: JSON_IMPORT,
    payload: settingsDump,
  });

  return true;
};

export default getImportJSON;
