/* eslint-disable default-param-last */
import { Actions } from '../actions';

const syncLastUpdateReducer = (value = {}, action) => {
  switch (action.type) {
    case Actions.LAST_UPDATE_DROPBOX_REMOTE:
      return {
        ...value,
        dropbox: action.payload,
      };
    case Actions.DROPBOX_SETTINGS_IMPORT:
      return {
        ...value,
        dropbox: action.payload.state.lastUpdateUTC,
        local: action.payload.state.lastUpdateUTC,
      };
    case Actions.STORAGE_SYNC_DONE:
      return {
        ...value,
      };


    // ToDo: check for more action types which cause syncable data to be updated
    // case Actions.SET_DROPBOX_STORAGE: // Don't use!
    case Actions.UPDATE_IMAGE:
    case Actions.REHASH_IMAGE:
    case Actions.UPDATE_IMAGES_BATCH:
    case Actions.DELETE_IMAGE:
    case Actions.PALETTE_UPDATE:
    case Actions.PALETTE_DELETE:
    case Actions.ADD_IMAGES:
    case Actions.ADD_FRAME:
    case Actions.DELETE_FRAME:
      return {
        ...value,
        local: Math.floor((new Date()).getTime() / 1000),
      };
    default:
      return value;
  }
};

export default syncLastUpdateReducer;
