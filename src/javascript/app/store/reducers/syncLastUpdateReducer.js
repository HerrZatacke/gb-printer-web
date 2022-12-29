import {
  ADD_FRAME,
  ADD_IMAGES,
  DELETE_FRAME,
  DELETE_IMAGE,
  DROPBOX_SETTINGS_IMPORT,
  LAST_UPDATE_DROPBOX_REMOTE,
  PALETTE_DELETE,
  PALETTE_UPDATE,
  REHASH_IMAGE,
  STORAGE_SYNC_DONE,
  UPDATE_IMAGE,
  UPDATE_IMAGES_BATCH,
} from '../actions';

const syncLastUpdateReducer = (value = {}, action) => {
  switch (action.type) {
    case LAST_UPDATE_DROPBOX_REMOTE:
      return {
        ...value,
        dropbox: action.payload,
      };
    case DROPBOX_SETTINGS_IMPORT:
      return {
        ...value,
        dropbox: action.payload.state.lastUpdateUTC,
        local: action.payload.state.lastUpdateUTC,
      };
    case STORAGE_SYNC_DONE:
      return {
        ...value,
      };


    // ToDo: check for more action types which cause syncable data to be updated
    // case SET_DROPBOX_STORAGE: // Don't use!
    case UPDATE_IMAGE:
    case REHASH_IMAGE:
    case UPDATE_IMAGES_BATCH:
    case DELETE_IMAGE:
    case PALETTE_UPDATE:
    case PALETTE_DELETE:
    case ADD_IMAGES:
    case ADD_FRAME:
    case DELETE_FRAME:
      return {
        ...value,
        local: Math.floor((new Date()).getTime() / 1000),
      };
    default:
      return value;
  }
};

export default syncLastUpdateReducer;
