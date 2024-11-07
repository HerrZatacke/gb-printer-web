import getFrameGroups from '../getFrameGroups';
import useSettingsStore from '../../app/stores/settingsStore';
import { Actions } from '../../app/store/actions';
import readFileAs, { ReadAs } from '../readFileAs';
import getImportSav from './importSav';
import type { TypedStore } from '../../app/store/State';
import type { DialogOption,
  DialogQuestion,
  DialogResult } from '../../../types/Dialog';
import {
  DialoqQuestionType,
} from '../../../types/Dialog';
import type { ConfirmAnsweredAction, ConfirmAskAction } from '../../../types/actions/ConfirmActions';
import { reduceItems } from '../reduceArray';

const getTransformSav = (
  { getState, dispatch }: TypedStore,
) => async (file: File, skipDialogs: boolean): Promise<boolean> => {
  const { savFrameTypes, setSavFrameTypes } = useSettingsStore.getState();
  const data = await readFileAs(file, ReadAs.UINT8_ARRAY);

  const {
    frames,
    frameGroupNames,
  } = getState();

  const {
    importLastSeen,
    importDeleted,
    forceMagicCheck,
  } = useSettingsStore.getState();

  const frameGroupOptions: DialogOption[] = getFrameGroups(frames, frameGroupNames)
    .map(({ id: value, name }) => ({
      value,
      name,
      selected: savFrameTypes === value,
    }));

  frameGroupOptions.unshift({ value: '', name: 'None (Black frame)' });

  const importSav = getImportSav({
    importLastSeen: skipDialogs ? true : importLastSeen,
    data,
    lastModified: file.lastModified,
    frames,
    fileName: file.name,
    importDeleted: skipDialogs ? true : importDeleted,
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
    dispatch<ConfirmAskAction>({
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
          } : undefined,
        ].reduce(reduceItems<DialogQuestion>, [])),
        confirm: async (result: DialogResult): Promise<void> => {
          const { chosenFrameset, cartIsJP } = result as { chosenFrameset: string, cartIsJP: boolean };
          dispatch<ConfirmAnsweredAction>({
            type: Actions.CONFIRM_ANSWERED,
          });

          setSavFrameTypes(chosenFrameset);

          // Perform actual import action
          await importSav(chosenFrameset || '', Boolean(cartIsJP));
          resolve(true);
        },
        deny: async () => {
          dispatch<ConfirmAnsweredAction>({
            type: Actions.CONFIRM_ANSWERED,
          });
          resolve(true);
        },
      },
    });
  }));
};

export default getTransformSav;
