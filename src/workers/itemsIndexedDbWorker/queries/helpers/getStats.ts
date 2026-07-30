import { getDb } from '@/workers/itemsIndexedDbWorker/db';
import { ItemsStatsResponse } from '@/workers/itemsIndexedDbWorker/types';

export const getStats = async (): Promise<ItemsStatsResponse> => {
  const db = await getDb();
  const startTime = performance.now();

  const [
    frameGroups,
    frames,
    imageGroups,
    images,
    palettes,
    plugins,
    binaryImages,
    binaryFrames,
  ] = await Promise.all([
    db.count('framegroups'),
    db.count('frames'),
    db.count('imagegroups'),
    db.count('images'),
    db.count('palettes'),
    db.count('plugins'),
    db.count('binaryimages'),
    db.count('binaryframes'),
  ]);

  const duration = performance.now() - startTime;

  return {
    totals: {
      frameGroups,
      frames,
      imageGroups,
      images,
      palettes,
      plugins,
      binaryImages,
      binaryFrames,
    },
    duration,
  };
};
