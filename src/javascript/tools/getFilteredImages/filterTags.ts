import { SpecialTags } from '../../consts/SpecialTags';
import { Image } from '../../../types/Image';

const filterTags = (activeTags: (SpecialTags | string)[]) => (image: Image): boolean => {

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
      .includes(tag as SpecialTags)
  ));

  if (normalTags.length) {
    return !!image.tags.find((tag) => normalTags.includes(tag));
  }

  // Not filtering for tags
  return true;
};

export default filterTags;
