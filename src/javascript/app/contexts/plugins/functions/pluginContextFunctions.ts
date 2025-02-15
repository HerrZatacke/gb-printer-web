import { CompatibilityActionType } from '../../../../../types/PluginCompatibility';
import type { CompatibilityAction, PluginCompatibilityWrapper } from '../../../../../types/PluginCompatibility';
import getHandleFileImport from '../../../../tools/getHandleFileImport';
import type { UseStores } from '../../../../hooks/useStores';
import type { ImportFn } from '../../../../hooks/useImportExportSettings';

export const pluginCompatibilityStore = (
  { addImages, setDialog, dismissDialog }: UseStores,
  importFn: ImportFn,
): PluginCompatibilityWrapper => {
  const handleFileImport = getHandleFileImport(importFn);


  return ({
    dispatch: (action: CompatibilityAction) => {
      switch (action.type) {
        case CompatibilityActionType.CONFIRM_ASK:
          setDialog(action.payload);
          break;

        case CompatibilityActionType.CONFIRM_ANSWERED:
          dismissDialog(0);
          break;

        case CompatibilityActionType.IMPORT_FILES:
          handleFileImport(action.payload.files);
          break;

        case CompatibilityActionType.ADD_IMAGES:
          addImages(action.payload);
          break;

        default:
          console.error(`Unhandled Compatibility Action (type:"${(action as CompatibilityAction).type}")`);
          break;
      }
    },
  });
};
