import getFrameGroups from '../getFrameGroups';
import { Actions } from '../../app/store/actions';
import readFileAs, { ReadAs } from '../readFileAs';
import getImportSav from './importSav';
import { TypedStore } from '../../app/store/State';
import { DialogOption } from '../../../types/actions/ConfirmActions';

const getTransformSav = (
  { getState, dispatch }: TypedStore,
) => async (file: File, skipDialogs: boolean): Promise<boolean> => {
  const data = await readFileAs(file, ReadAs.UINT8_ARRAY);

  const {
    savFrameTypes: selectedFrameset,
    frames,
    frameGroupNames,
    importLastSeen,
    importDeleted,
    forceMagicCheck,
  } = getState();

  const frameGroupOptions: DialogOption[] = getFrameGroups(frames, frameGroupNames)
    .map(({ id: value, name }) => ({
      value,
      name,
      selected: selectedFrameset === value,
    }));

  frameGroupOptions.unshift({ value: '', name: 'None (Black frame)' });

  const importSav = getImportSav({
    importLastSeen: skipDialogs ? true : importLastSeen,
    data,
    lastModified: file.lastModified,
    frames,
    fileName: file.name,
    importDeleted: skipDialogs ? true : importDeleted,
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
      type: Actions.CONFIRM_ASK,
      payload: {
        message: `Importing '${file.name}'`,
        questions: () => [
          {
            label: 'Import is from a Japanese Cart (PocketCamera)',
            key: 'cartIsJP',
            type: 'checkbox',
          },
          frameGroupOptions.length > 1 ? {
            label: 'Select frame group to use with this import',
            key: 'chosenFrameset',
            type: 'select',
            options: frameGroupOptions,
          } : null,
        ].filter(Boolean),
        confirm: async ({ chosenFrameset, cartIsJP }: { chosenFrameset: string, cartIsJP: boolean }): Promise<void> => {
          dispatch({
            type: Actions.CONFIRM_ANSWERED,
          });

          // Perform actual import action
          await importSav(chosenFrameset || '', Boolean(cartIsJP));
          resolve(true);
        },
        deny: () => {
          dispatch({
            type: Actions.CONFIRM_ANSWERED,
          });
          resolve(true);
        },
      },
    });
  }));
};

export default getTransformSav;
