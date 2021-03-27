import {
  FILTER_UNTAGGED,
  FILTER_NEW,
  FILTER_MONOCHROME,
  FILTER_RGB,
  FILTER_RECENT,
} from '../../../consts/specialTags';

const specialTags = [
  FILTER_UNTAGGED,
  FILTER_NEW,
  FILTER_MONOCHROME,
  FILTER_RGB,
  FILTER_RECENT,
];

const activeTags = (value = [], action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TAGS':
      return action.payload;
    case 'SET_AVAILABLE_TAGS':
      return value.filter((tag) => (
        specialTags.includes(tag) ||
        action.payload.includes(tag)
      ));
    default:
      return value;
  }
};

export default activeTags;
