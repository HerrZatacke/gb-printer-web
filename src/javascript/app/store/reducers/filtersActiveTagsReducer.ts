/* eslint-disable default-param-last */
import { Actions } from '../actions';
import { SpecialTags } from '../../../consts/SpecialTags';
import { SetActiveTagsAction, SetAvailableTagsAction } from '../../../../types/actions/TagsActions';

const specialTags: string[] = [
  SpecialTags.FILTER_UNTAGGED,
  SpecialTags.FILTER_NEW,
  SpecialTags.FILTER_MONOCHROME,
  SpecialTags.FILTER_RGB,
  SpecialTags.FILTER_RECENT,
];

const activeTagsReducer = (value: string[] = [], action: SetActiveTagsAction | SetAvailableTagsAction): string[] => {
  switch (action.type) {
    case Actions.SET_ACTIVE_TAGS:
      return action.payload || value;
    case Actions.SET_AVAILABLE_TAGS:
      return value.filter((tag) => (
        specialTags.includes(tag) ||
        action.payload?.includes(tag)
      ));
    default:
      return value;
  }
};

export default activeTagsReducer;
