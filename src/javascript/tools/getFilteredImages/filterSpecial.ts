import dayjs from 'dayjs';
import { SpecialTags } from '../../consts/SpecialTags';
import { dateFormat } from '../../app/defaults';
import type { RecentImport } from '../../../types/Sync';
import type { Image } from '../../../types/Image';
import { isRGBNImage } from '../isRGBNImage';

const filterSpecial = (
  activeTags: string[],
  recentImports: RecentImport[],
) => (image: Image): boolean => {
  const activeSpecialTags: SpecialTags[] = activeTags
    .reduce((acc: SpecialTags[], tag: string): SpecialTags[] => {
      const included = [
        SpecialTags.FILTER_MONOCHROME,
        SpecialTags.FILTER_NEW,
        SpecialTags.FILTER_RGB,
        SpecialTags.FILTER_UNTAGGED,
        SpecialTags.FILTER_RECENT,
        SpecialTags.FILTER_FAVOURITE,
        SpecialTags.FILTER_COMMENTS,
        SpecialTags.FILTER_USERNAME,
      ]
        .includes(tag as SpecialTags);

      return included ? [...acc, tag as SpecialTags] : acc;
    }, []);

  if (activeSpecialTags.length) {

    // 1) Keep untagged images
    if (activeSpecialTags.includes(SpecialTags.FILTER_UNTAGGED) && image.tags.length !== 0) {
      return false;
    }

    // 2) Keep "new" images
    if (activeSpecialTags.includes(SpecialTags.FILTER_NEW)) {
      const date = dayjs(image.created, dateFormat)
        .unix();
      const maxNew = dayjs()
        .subtract(1, 'day')
        .unix();

      if (date <= maxNew) {
        return false;
      }
    }

    // 3) Keep recent images
    if (
      activeSpecialTags.includes(SpecialTags.FILTER_RECENT) &&
      !recentImports.map(({ hash }) => hash).includes(image.hash)
    ) {
      return false;
    }

    // 4) Keep rgb images
    if (activeSpecialTags.includes(SpecialTags.FILTER_RGB) && !isRGBNImage(image)) {
      return false;
    }

    // 5) Keep monochrome images
    if (activeSpecialTags.includes(SpecialTags.FILTER_MONOCHROME) && isRGBNImage(image)) {
      return false;
    }

    // 6) Keep favourited images
    if (
      activeSpecialTags.includes(SpecialTags.FILTER_FAVOURITE) &&
      !image.tags.includes(SpecialTags.FILTER_FAVOURITE)
    ) {
      return false;
    }

    // 7) Keep images with comments
    if (activeSpecialTags.includes(SpecialTags.FILTER_COMMENTS) && !image.meta?.comment) {
      return false;
    }

    // 8) Keep images with set username
    if (activeSpecialTags.includes(SpecialTags.FILTER_USERNAME) && !image.meta?.userName) {
      return false;
    }

    // Filtering for special, but no conditions are met
    return true;
  }

  // Not filtering for special, keep all
  return true;
};

export default filterSpecial;
