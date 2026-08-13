import {
  type FrameUsage,
  type ItemsStatsResponse,
  type ItemsUsageReponse,
  type PaletteUsage,
} from 'gb-printer-schemas';
import { getDb } from '@/workers/itemsIndexedDbWorker/db';

export const getStats = async (): Promise<ItemsStatsResponse> => {
  const { db } = await getDb();
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

export const getUsages = async (): Promise<ItemsUsageReponse> => {
  const { db } = await getDb();
  const startTime = performance.now();

  const paletteUsageCounts = new Map<string, number>();
  const frameUsageCounts = new Map<string, number>();

  const { store } = db.transaction('images');
  let cursor = await store.openCursor();

  while (cursor) {
    const image = cursor.value;

    if (image.type === 'mono' && image.palette) {
      paletteUsageCounts.set(image.palette, (paletteUsageCounts.get(image.palette) ?? 0) + 1);
    }

    if (image.frame) {
      frameUsageCounts.set(image.frame, (frameUsageCounts.get(image.frame) ?? 0) + 1);
    }

    cursor = await cursor.continue();
  }

  const palettes: PaletteUsage[] = [...paletteUsageCounts.entries()].map(([shortName, usage]) => ({ shortName, usage }));
  const frames: FrameUsage[] = [...frameUsageCounts.entries()].map(([id, usage]) => ({ id, usage }));

  return {
    totals: {
      palettes,
      frames,
    },
    duration: performance.now() - startTime,
  };
};
