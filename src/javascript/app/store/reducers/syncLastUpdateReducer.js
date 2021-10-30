const syncLastUpdateReducer = (value = {}, action) => {
  switch (action.type) {
    case 'LAST_UPDATE_DROPBOX_REMOTE':
      return {
        ...value,
        dropbox: action.payload,
      };
    case 'DROPBOX_SETTINGS_IMPORT':
      return {
        ...value,
        dropbox: action.payload.state.lastUpdateUTC,
        local: action.payload.state.lastUpdateUTC,
      };
    case 'STORAGE_SYNC_DONE':
      return {
        ...value,
      };


    // ToDo: check for more action types which cause syncable data to be updated
    case 'UPDATE_IMAGE':
    case 'PALETTE_UPDATE':
    case 'ADD_FDAME':
      return {
        ...value,
        local: Math.floor((new Date()).getTime() / 1000),
      };
    default:
      return value;
  }
};

export default syncLastUpdateReducer;
