/* eslint-disable default-param-last */
import dayjs from 'dayjs';
import { Actions } from '../actions';
import { AddImagesAction } from '../../../../types/actions/ImageActions';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { RecentImport } from '../../../../types/Sync';
import { Image, RGBNImage } from '../../../../types/Image';
import uniqueBy from '../../../tools/unique/by';

const recentImportsReducer = (
  value: RecentImport[] = [],
  action: AddImagesAction | GlobalUpdateAction,
): RecentImport[] => {
  switch (action.type) {
    case Actions.ADD_IMAGES: {

      const imported: RecentImport[] = action.payload.reduce((acc: RecentImport[], image: Image) => {
        // ignore RGBN images
        if ((image as RGBNImage).hashes) {
          return acc;
        }

        return [
          ...acc,
          {
            hash: image.hash,
            timestamp: dayjs().unix(),
          },
        ];
      }, []);

      return uniqueBy<RecentImport>('hash')([
        ...value,
        ...imported,
      ]);
    }

    case Actions.GLOBAL_UPDATE: {
      if (action.payload?.imageSelection?.length) {
        return uniqueBy<RecentImport>('hash')([
          ...value,
          ...action.payload.imageSelection.map((hash) => ({
            hash,
            timestamp: dayjs().unix(),
          })),
        ]);
      }

      return value;
    }

    default:
      return value;
  }
};

export default recentImportsReducer;
