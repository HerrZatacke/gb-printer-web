import { type StoredImage } from 'gb-printer-schemas';
import { Repositories } from '@/workers/itemsIndexedDbWorker/repository/entities';

export const resolveAndFilterImages = async (
  repositories: Repositories,
  matches?: (item: StoredImage) => boolean,
  seedIds?: Set<string>,
): Promise<StoredImage[]> => {
  if (!matches && !seedIds) {
    return repositories.images.getAll();
  }

  if (typeof seedIds === 'undefined') {
    const images: StoredImage[] = [];

    for await (const image of repositories.images.iterate()) {
      if (!matches || matches(image)) {
        images.push(image);
      }
    }

    return images;
  }

  const seededEntries = await repositories.images.getEntriesByKeys([...seedIds]);
  const seededImages = seededEntries.map((entry) => entry.value);
  return matches ? seededImages.filter(matches) : seededImages;
};
