import updateIfDefined from '../../../tools/updateIfDefined';

const sortByReducer = (value = '', action) => {
  switch (action.type) {
    case 'SET_SORT_BY':
      return action.payload;
    case 'GLOBAL_UPDATE':
      return updateIfDefined(action.payload.sortBy, value);
    default:
      return value;
  }
};

export default sortByReducer;
