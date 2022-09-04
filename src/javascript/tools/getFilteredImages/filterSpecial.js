import dayjs from 'dayjs';
import {
  FILTER_MONOCHROME,
  FILTER_NEW,
  FILTER_RGB,
  FILTER_UNTAGGED,
  FILTER_RECENT,
  FILTER_FAVOURITE,
} from '../../consts/specialTags';
import { dateFormat } from '../../app/defaults';

const filterSpecial = (activeTags, recentImports) => (image) => {

  const activeSpecialTags = activeTags.filter((tag) => (
    [FILTER_MONOCHROME, FILTER_NEW, FILTER_RGB, FILTER_UNTAGGED, FILTER_RECENT, FILTER_FAVOURITE]
      .includes(tag)
  ));

  if (activeSpecialTags.length) {

    // 1) Keep untagged images
    if (activeSpecialTags.includes(FILTER_UNTAGGED) && image.tags.length !== 0) {
      return false;
    }

    // 2) Keep "new" images
    if (activeSpecialTags.includes(FILTER_NEW)) {
      const date = dayjs(image.created, dateFormat)
        .unix();
      const maxNew = dayjs()
        .subtract('1', 'day')
        .unix();

      if (date <= maxNew) {
        return false;
      }
    }

    // 3) Keep recent images
    if (activeSpecialTags.includes(FILTER_RECENT) && !recentImports.map(({ hash }) => hash).includes(image.hash)) {
      return false;
    }

    // 4) Keep rgb images
    if (activeSpecialTags.includes(FILTER_RGB) && !image.hashes) {
      return false;
    }

    // 5) Keep monochrome images
    if (activeSpecialTags.includes(FILTER_MONOCHROME) && !!image.hashes) {
      return false;
    }

    // 6) Keep favourited images
    if (activeSpecialTags.includes(FILTER_FAVOURITE) && !image.tags.includes(FILTER_FAVOURITE)) {
      return false;
    }

    // Filtering for special, but no conditions are met
    return true;
  }

  // Not filtering for special, keep all
  return true;
};

export default filterSpecial;
