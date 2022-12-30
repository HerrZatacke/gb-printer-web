import getFrameGroups from '../getFrameGroups';
import { CONFIRM_ANSWERED, CONFIRM_ASK } from '../../app/store/actions';
import readFileAs from '../readFileAs';
import getImportSav from './importSav';

const getTransformSav = ({ getState, dispatch }) => async (file) => {
  const data = await readFileAs(file, 'arrayBuffer');

  const { savFrameTypes: selectedFrameset, frames, importLastSeen, importDeleted } = getState();

  const frameGroups = getFrameGroups(frames)
    .map(({ id: value, name }) => ({
      value,
      name,
      selected: selectedFrameset === value,
    }));

  frameGroups.unshift({ value: '', name: 'None (Black frame)' });

  const importSav = getImportSav({
    importLastSeen,
    data,
    frames,
    fileName: file.name,
    importDeleted,
    dispatch,
  });

  if (frameGroups.length < 2) {
    return importSav(selectedFrameset);
  }

  return new Promise(((resolve) => {

    dispatch({
      type: CONFIRM_ASK,
      payload: {
        message: `Importing '${file.name}'`,
        questions: () => [
          {
            label: 'Select frame group to use with this import',
            key: 'chosenFrameset',
            type: 'select',
            options: frameGroups,
          },
        ],
        confirm: async ({ chosenFrameset }) => {
          dispatch({
            type: CONFIRM_ANSWERED,
          });

          // Perform actual import action
          await importSav(chosenFrameset);
          resolve(true);
        },
        deny: () => {
          dispatch({
            type: CONFIRM_ANSWERED,
          });
          resolve(true);
        },
      },
    });
  }));
};

export default getTransformSav;
