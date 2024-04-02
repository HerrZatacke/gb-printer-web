/* eslint-disable default-param-last */
import dayjs from 'dayjs';
import { Actions } from '../actions';

const recentImportsReducer = (value = [], action) => {
  switch (action.type) {
    case Actions.ADD_IMAGES: {

      const imported = action.payload.map(({ hash, hashes }) => {

        // ignore RGBN images
        if (hashes) {
          return null;
        }

        return {
          hash,
          timestamp: dayjs().unix(),
        };
      })
        .filter(Boolean);

      return [
        ...value.filter(({ hash }) => !imported.includes(hash)),
        ...imported,
      ];
    }

    case Actions.GLOBAL_UPDATE: {
      if (action.payload?.imageSelection?.length) {
        return [

          // remove possible duplicates
          ...value.filter(({ hash }) => (
            !action.payload.imageSelection.includes(hash)
          )),

          // add the actual new hashes
          ...action.payload.imageSelection.map((hash) => ({
            hash,
            timestamp: dayjs().unix(),
          })),
        ];
      }

      return value;
    }

    default:
      return value;
  }
};

export default recentImportsReducer;
