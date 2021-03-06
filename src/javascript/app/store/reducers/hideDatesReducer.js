import updateIfDefined from '../../../tools/updateIfDefined';

const hideDatesReducer = (value = false, action) => {
  switch (action.type) {
    case 'SET_HIDE_DATES':
      return action.payload;
    case 'GLOBAL_UPDATE':
      return updateIfDefined(action.payload.hideDates, value);
    default:
      return value;
  }
};

export default hideDatesReducer;
