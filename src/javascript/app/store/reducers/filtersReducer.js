import { combineReducers } from 'redux';
import activeTags from './filters/activeTagsReducer';
import availableTags from './filters/availableTagsReducer';

const filtersReducer = combineReducers({
  activeTags,
  availableTags,
});


export default filtersReducer;
