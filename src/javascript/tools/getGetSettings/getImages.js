import { localforageImages } from '../localforageInstance';

const getImages = (what, exportImageHashes) => (
  Promise.all(exportImageHashes.map((hash) => (
    localforageImages.getItem(hash)
      .then((data) => ({
        hash,
        data,
      }))
  )))
    .then((result) => {
      const images = {};
      result.forEach(({ hash, data }) => {
        images[hash] = data;
      });

      return images;
    })
);

export default getImages;
