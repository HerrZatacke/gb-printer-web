import dayjs from 'dayjs';

const recentImportsReducer = (value = [], action) => {
  switch (action.type) {
    case 'ADD_IMAGE': {

      // ignore RGBN images
      if (action.payload.hashes) {
        return value;
      }

      return [
        ...value.filter(({ hash }) => hash !== action.payload.hash),
        {
          hash: action.payload.hash,
          timestamp: dayjs().unix(),
        },
      ];
    }

    case 'ADD_IMAGES': {

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

    case 'GLOBAL_UPDATE': {
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
