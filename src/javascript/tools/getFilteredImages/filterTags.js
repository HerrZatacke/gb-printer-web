import {
  FILTER_COMMENTS,
  FILTER_FAVOURITE,
  FILTER_MONOCHROME,
  FILTER_NEW,
  FILTER_RECENT,
  FILTER_RGB,
  FILTER_UNTAGGED,
  FILTER_USERNAME,
} from '../../consts/specialTags';

const filterTags = (activeTags) => (image) => {

  const normalTags = activeTags.filter((tag) => (
    ![
      FILTER_MONOCHROME,
      FILTER_NEW,
      FILTER_RGB,
      FILTER_UNTAGGED,
      FILTER_RECENT,
      FILTER_FAVOURITE,
      FILTER_COMMENTS,
      FILTER_USERNAME,
    ]
      .includes(tag)
  ));

  if (normalTags.length) {
    return image.tags.find((tag) => normalTags.includes(tag));
  }

  // Not filtering for tags
  return true;
};

export default filterTags;
