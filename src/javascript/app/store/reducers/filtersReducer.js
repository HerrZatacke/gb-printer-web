import { combineReducers } from 'redux';
import activeTags from './filters/activeTagsReducer';
import availableTags from './filters/availableTagsReducer';
import visible from './filters/visibleReducer';

const filtersReducer = combineReducers({
  activeTags,
  availableTags,
  visible,
});


export default filtersReducer;
