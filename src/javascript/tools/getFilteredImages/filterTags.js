import { SpecialTags } from '../../consts/specialTags';

const filterTags = (activeTags) => (image) => {

  const normalTags = activeTags.filter((tag) => (
    ![
      SpecialTags.FILTER_MONOCHROME,
      SpecialTags.FILTER_NEW,
      SpecialTags.FILTER_RGB,
      SpecialTags.FILTER_UNTAGGED,
      SpecialTags.FILTER_RECENT,
      SpecialTags.FILTER_FAVOURITE,
      SpecialTags.FILTER_COMMENTS,
      SpecialTags.FILTER_USERNAME,
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
