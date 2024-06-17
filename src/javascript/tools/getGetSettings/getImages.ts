import { localforageImages } from '../localforageInstance';

const getImages = async (exportImageHashes: string[]): Promise<Record<string, string>> => {
  const result = await Promise.all(exportImageHashes.map(async (hash) => {
    const data = await localforageImages.getItem(hash);
    return ({
      hash,
      data,
    });
  }));

  const images: Record<string, string> = {};
  result.forEach(({
    hash,
    data,
  }) => {
    if (data) {
      images[hash] = data;
    }
  });

  return images;
};

export default getImages;
