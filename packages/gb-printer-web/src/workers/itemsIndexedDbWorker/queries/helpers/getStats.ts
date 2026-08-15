import {
  type FrameUsage,
  type ItemsStatsResponse,
  type ItemsUsageReponse,
  type PaletteUsage,
} from 'gb-printer-schemas';
import { type ItemsSourceInternal } from '@/workers/itemsIndexedDbWorker/types';

export async function getStats(this: ItemsSourceInternal): Promise<ItemsStatsResponse> {
  const { repositories } = this;
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
    repositories.frameGroups.count(),
    repositories.frames.count(),
    repositories.imageGroups.count(),
    repositories.images.count(),
    repositories.palettes.count(),
    repositories.plugins.count(),
    repositories.binaryImages.count(),
    repositories.binaryFrames.count(),
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
}

export async function getUsages(this: ItemsSourceInternal): Promise<ItemsUsageReponse> {
  const { images: repository } = this.repositories;
  const startTime = performance.now();

  const paletteUsageCounts = new Map<string, number>();
  const frameUsageCounts = new Map<string, number>();

  for await (const image of repository.iterate()) {
    if (image.type === 'mono' && image.palette) {
      paletteUsageCounts.set(image.palette, (paletteUsageCounts.get(image.palette) ?? 0) + 1);
    }

    if (image.frame) {
      frameUsageCounts.set(image.frame, (frameUsageCounts.get(image.frame) ?? 0) + 1);
    }
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
}
