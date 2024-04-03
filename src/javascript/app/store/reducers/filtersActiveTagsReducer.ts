/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { SpecialTags } from '../../../consts/specialTags';

const specialTags: string[] = [
  SpecialTags.FILTER_UNTAGGED,
  SpecialTags.FILTER_NEW,
  SpecialTags.FILTER_MONOCHROME,
  SpecialTags.FILTER_RGB,
  SpecialTags.FILTER_RECENT,
];

type ActiveTagsAction = {
  type: Actions.SET_ACTIVE_TAGS | Actions.SET_AVAILABLE_TAGS,
  payload: string[],
}

const activeTagsReducer = (value: string[] = [], action: ActiveTagsAction): string[] => {
  switch (action.type) {
    case Actions.SET_ACTIVE_TAGS:
      return action.payload;
    case Actions.SET_AVAILABLE_TAGS:
      return value.filter((tag) => (
        specialTags.includes(tag) ||
        action.payload.includes(tag)
      ));
    default:
      return value;
  }
};

export default activeTagsReducer;
