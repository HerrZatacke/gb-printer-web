import useDialogsStore from '../../../stores/dialogsStore';
import { CompatibilityActionType } from '../../../../../types/PluginCompatibility';
import { Actions } from '../../../store/actions';
import type { CompatibilityAction, PluginCompatibilityWrapper } from '../../../../../types/PluginCompatibility';
import type { AddImagesAction } from '../../../../../types/actions/ImageActions';
import type { TypedStore } from '../../../store/State';
import getHandleFileImport from '../../../../tools/getHandleFileImport';

const { setDialog, dismissDialog } = useDialogsStore.getState();


export const pluginCompatibilityStore = (store: TypedStore): PluginCompatibilityWrapper => {
  const handleFileImport = getHandleFileImport(store);

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
          store.dispatch<AddImagesAction>({
            type: Actions.ADD_IMAGES,
            payload: action.payload,
          });
          break;

        default:
          console.error(`Unhandled Compatibility Action (type:"${(action as CompatibilityAction).type}")`);
          break;
      }
    },
  });
};
