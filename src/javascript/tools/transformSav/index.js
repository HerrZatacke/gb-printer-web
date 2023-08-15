import getFrameGroups from '../getFrameGroups';
import { CONFIRM_ANSWERED, CONFIRM_ASK } from '../../app/store/actions';
import readFileAs from '../readFileAs';
import getImportSav from './importSav';

const getTransformSav = ({ getState, dispatch }) => async (file, skipDialogs) => {
  const data = await readFileAs(file, 'arrayBuffer');

  const {
    savFrameTypes: selectedFrameset,
    frames,
    frameGroupNames,
    importLastSeen,
    importDeleted,
    forceMagicCheck,
  } = getState();

  const frameGroups = getFrameGroups(frames, frameGroupNames)
    .map(({ id: value, name }) => ({
      value,
      name,
      selected: selectedFrameset === value,
    }));

  frameGroups.unshift({ value: '', name: 'None (Black frame)' });

  const importSav = getImportSav({
    importLastSeen,
    data,
    lastModified: file.lastModified,
    frames,
    fileName: file.name,
    importDeleted,
    dispatch,
    forceMagicCheck: skipDialogs ? false : forceMagicCheck,
  });

  if (!importSav) {
    throw new Error('.sav file seems to be invalid');
  }

  if (skipDialogs) {
    await importSav('', false);
    return true;
  }

  return new Promise(((resolve) => {
    dispatch({
      type: CONFIRM_ASK,
      payload: {
        message: `Importing '${file.name}'`,
        questions: () => [
          {
            label: 'Import is from a Japanese Cart (PocketCamera)',
            key: 'cartIsJP',
            type: 'checkbox',
          },
          frameGroups.length > 1 ? {
            label: 'Select frame group to use with this import',
            key: 'chosenFrameset',
            type: 'select',
            options: frameGroups,
          } : null,
        ].filter(Boolean),
        confirm: async ({ chosenFrameset, cartIsJP }) => {
          dispatch({
            type: CONFIRM_ANSWERED,
          });

          // Perform actual import action
          await importSav(chosenFrameset || '', Boolean(cartIsJP));
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
