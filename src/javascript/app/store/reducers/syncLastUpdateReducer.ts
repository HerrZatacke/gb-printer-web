/* eslint-disable default-param-last */
import { Actions } from '../actions';
import type {
  DropboxLastUpdateAction,
  DropboxSettingsImportAction,
} from '../../../../types/actions/StorageActions';
import type { SyncLastUpdate } from '../../../../types/Sync';
import type { LogStorageSyncDoneAction } from '../../../../types/actions/LogActions';
import type {
  AddImagesAction,
  DeleteImageAction, ImageFavouriteAction,
  ImagesUpdateAction,
  RehashImageAction,
  DeleteImagesAction,
} from '../../../../types/actions/ImageActions';
import type { PaletteDeleteAction, PaletteUpdateAction } from '../../../../types/actions/PaletteActions';
import type {
  AddFrameAction,
  DeleteFrameAction,
  FrameGroupNamesAction,
  UpdateFrameAction,
} from '../../../../types/actions/FrameActions';


const syncLastUpdateReducer = (
  value: SyncLastUpdate = { dropbox: 0, local: 0 },
  action:
    RehashImageAction |
    ImagesUpdateAction |
    DeleteImageAction |
    DeleteImagesAction |
    PaletteUpdateAction |
    PaletteDeleteAction |
    AddImagesAction |
    AddFrameAction |
    UpdateFrameAction |
    FrameGroupNamesAction |
    DeleteFrameAction |
    ImageFavouriteAction |
    DropboxLastUpdateAction |
    LogStorageSyncDoneAction |
    DropboxSettingsImportAction,
): SyncLastUpdate => {
  switch (action.type) {
    case Actions.LAST_UPDATE_DROPBOX_REMOTE:
      return {
        ...value,
        dropbox: action.payload,
      };
    case Actions.DROPBOX_SETTINGS_IMPORT:
      return {
        ...value,
        dropbox: action.payload?.state.lastUpdateUTC || value.dropbox,
        local: action.payload?.state.lastUpdateUTC || value.local,
      };
    case Actions.STORAGE_SYNC_DONE:
      return {
        ...value,
      };


    // ToDo: check for more action types which cause syncable data to be updated
    // case Actions.SET_DROPBOX_STORAGE: // Don't use!
    case Actions.REHASH_IMAGE:
    case Actions.UPDATE_IMAGES:
    case Actions.DELETE_IMAGE:
    case Actions.DELETE_IMAGES:
    case Actions.PALETTE_UPDATE:
    case Actions.PALETTE_DELETE:
    case Actions.ADD_IMAGES:
    case Actions.ADD_FRAME:
    case Actions.UPDATE_FRAME:
    case Actions.NAME_FRAMEGROUP:
    case Actions.DELETE_FRAME:
    case Actions.IMAGE_FAVOURITE_TAG:
      return {
        ...value,
        local: Math.floor((new Date()).getTime() / 1000),
      };
    default:
      return value;
  }
};

export default syncLastUpdateReducer;
