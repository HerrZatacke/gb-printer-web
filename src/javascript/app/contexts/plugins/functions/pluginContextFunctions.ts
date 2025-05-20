import type { CompatibilityAction, PluginCompatibilityWrapper } from '../../../../../types/PluginCompatibility';
import { CompatibilityActionType } from '../../../../../types/PluginCompatibility';
import getHandleFileImport from '../../../../tools/getHandleFileImport';
import type { UseStores } from '../../../../hooks/useStores';
import type { ImportFn } from '../../../../hooks/useImportExportSettings';
import type { DialogQuestion } from '../../../../../types/Dialog';
import { DialoqQuestionType } from '../../../../../types/Dialog';
import type { PluginFunctions } from '../../../../../types/Plugin';

export const pluginFunctions = (
  { addImages, setDialog, dismissDialog }: UseStores,
  importFn: ImportFn,
): PluginFunctions => {
  const handleFileImport = getHandleFileImport(importFn);

  const alert = (title: string, text: string) => setDialog({
    message: `Plugin: ${title}`,
    questions: (): DialogQuestion[] => ([
      {
        label: text,
        key: 'info',
        type: DialoqQuestionType.INFO,
      },
    ]),
    confirm: async () => dismissDialog(0),
  });

  return {
    importFiles: handleFileImport,
    setDialog,
    alert,
    dismissDialog: () => dismissDialog(0),
    addImages,
  };
};

export const pluginCompatibilityStore = (
  useStores: UseStores,
  importFn: ImportFn,
): PluginCompatibilityWrapper => {
  const { setDialog, dismissDialog, importFiles, addImages, alert } = pluginFunctions(useStores, importFn);

  return ({
    dispatch: (action: CompatibilityAction) => {
      console.warn(`You are using a legacy method: "dispatch(${action.type})". Please refer to "env.functions" from your plugin to switch to up-to-date methods`);
      switch (action.type) {
        case CompatibilityActionType.CONFIRM_ASK:
          setDialog(action.payload);
          break;

        case CompatibilityActionType.CONFIRM_ANSWERED:
          dismissDialog();
          break;

        case CompatibilityActionType.IMPORT_FILES:
          importFiles(action.payload.files);
          break;

        case CompatibilityActionType.ADD_IMAGES:
          addImages(action.payload);
          break;

        default:
          alert('Plugin error:', `Unhandled Compatibility Action (type:"${(action as CompatibilityAction).type}")`);
          break;
      }
    },
  });
};
