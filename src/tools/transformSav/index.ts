import { DialoqQuestionType } from '@/consts/dialog';
import { ImportMethod } from '@/consts/ImportMethod';
import { getFrameGroups } from '@/hooks/useFrameGroups';
import {
  useDialogsStore,
  useItemsStore,
  useSettingsStore,
} from '@/stores/stores';
import readFileAs, { ReadAs } from '@/tools/readFileAs';
import { reduceItems } from '@/tools/reduceArray';
import type { DialogOption, DialogQuestion, DialogResult } from '@/types/Dialog';
import { ImportResult } from '@/types/ImportItem';
import getImportSav from './importSav';

export interface TransformOptions {
  skipDialogs: boolean,
  frameSet?: string,
}

export const transformSav = async (file: File, options: TransformOptions): Promise<ImportResult> => {
  const { dismissDialog, setDialog } = useDialogsStore.getState();
  const { frames, frameGroups } = useItemsStore.getState();
  const { savFrameTypes, setSavFrameTypes } = useSettingsStore.getState();
  const data = await readFileAs(file, ReadAs.UINT8_ARRAY);

  const skipDialogs = options.skipDialogs || false;
  const frameSet = options.frameSet || '';

  const {
    importLastSeen,
    importDeleted,
    forceMagicCheck,
    savImportOrder,
  } = useSettingsStore.getState();

  const frameGroupOptions: DialogOption[] = getFrameGroups(frames, frameGroups)
    .map(({ id: value, name }) => ({
      value,
      name,
      selected: savFrameTypes === value,
    }));

  frameGroupOptions.unshift({ value: '', name: 'None (Black frame)' });

  const importSav = getImportSav({
    importLastSeen: (skipDialogs || file.size <= 0x1000) ? true : importLastSeen,
    savImportOrder,
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

  if (frameSet) {
    const imageCount = await importSav(frameSet, frameSet === 'jp');
    return {
      imageCount,
      importMethod: ImportMethod.SAV,
    };
  }

  if (skipDialogs) {
    const imageCount =await importSav('', false);
    return {
      imageCount,
      importMethod: ImportMethod.SAV,
    };
  }

  return new Promise(((resolve) => {
    setDialog({
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
        dismissDialog(0);
        setSavFrameTypes(chosenFrameset);

        // Perform actual import action
        const imageCount = await importSav(chosenFrameset || '', Boolean(cartIsJP));
        resolve({
          imageCount,
          importMethod: ImportMethod.SAV,
        });
      },
      deny: async () => {
        dismissDialog(0);
        resolve({
          imageCount: 0,
          importMethod: ImportMethod.SAV,
        });
      },
    });
  }));
};
