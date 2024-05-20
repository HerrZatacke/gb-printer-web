import getFrameGroups from '../getFrameGroups';
import { Actions } from '../../app/store/actions';
import readFileAs, { ReadAs } from '../readFileAs';
import getImportSav from './importSav';
import { TypedStore } from '../../app/store/State';
import { DialogOption, DialogQuestionBase, DialoqQuestionType } from '../../../types/Dialog';
import { ConfirmAnsweredAction, ConfirmAskAction } from '../../../types/actions/ConfirmActions';
import { reduceItems } from '../reduceArray';

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
        questions: () => ([
          {
            type: DialoqQuestionType.CHECKBOX,
            label: 'Import is from a Japanese Cart (PocketCamera)',
            key: 'cartIsJP',
          },
          frameGroupOptions.length > 1 ? {
            type: DialoqQuestionType.SELECT,
            label: 'Select frame group to use with this import',
            key: 'chosenFrameset',
            options: frameGroupOptions,
          } : null,
        ].reduce(reduceItems<DialogQuestionBase>, [])),
        confirm: async ({ chosenFrameset, cartIsJP }: { chosenFrameset: string, cartIsJP: boolean }): Promise<void> => {
          dispatch({
            type: Actions.CONFIRM_ANSWERED,
          } as ConfirmAnsweredAction);

          // Perform actual import action
          await importSav(chosenFrameset || '', Boolean(cartIsJP));
          resolve(true);
        },
        deny: () => {
          dispatch({
            type: Actions.CONFIRM_ANSWERED,
          } as ConfirmAnsweredAction);
          resolve(true);
        },
      },
    } as ConfirmAskAction);
  }));
};

export default getTransformSav;
