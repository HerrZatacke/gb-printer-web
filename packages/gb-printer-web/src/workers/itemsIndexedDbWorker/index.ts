import * as Comlink from 'comlink';
import {
  openAndPrepareDb,
  type PreparedDb,
} from '@/workers/itemsIndexedDbWorker/db';
import {
  deleteBinaryFramesByHashes,
  getBinaryFrameHashes,
  getBinaryFramesByHashes,
  updateBinaryFrames,
} from '@/workers/itemsIndexedDbWorker/queries/binaryFrames';
import {
  deleteBinaryImagesByHashes,
  getBinaryImageHashes,
  getBinaryImagesByHashes,
  updateBinaryImages,
} from '@/workers/itemsIndexedDbWorker/queries/binaryImages';
import {
  deleteFrameGroupsByIds,
  getFrameGroups,
  updateFrameGroups,
} from '@/workers/itemsIndexedDbWorker/queries/frameGroups';
import {
  deleteFramesByIds,
  getFrames,
  getFramesByHashes,
  getFramesByIds,
  updateFrames,
} from '@/workers/itemsIndexedDbWorker/queries/frames';
import {
  deleteImageGroupsByIds,
  getImageGroupsFullTree,
  getImageGroupsList,
  updateImageGroups,
} from '@/workers/itemsIndexedDbWorker/queries/imageGroups';
import {
  deleteImagesByHashes,
  getAllTags,
  getGroupItemsByGroupId,
  getHashesByGroupId,
  getImagesByHashes,
  getImagesByAnyHashes,
  getImages,
  updateImages,
} from '@/workers/itemsIndexedDbWorker/queries/images';
import {
  deletePalettesByShortNames,
  getPalettes,
  getPalettesByShortNames,
  updatePalettes,
} from '@/workers/itemsIndexedDbWorker/queries/palettes';
import {
  deletePluginsByUrls,
  getPlugins,
  getPluginsByUrls,
  updatePlugins,
} from '@/workers/itemsIndexedDbWorker/queries/plugins';
import {
  type InitWorkerFn,
  type ItemsHostApi,
  type ItemsSource,
  type WithDb,
} from '@/workers/itemsIndexedDbWorker/types';
import { getStats, getUsages } from './queries/helpers/getStats';
import { runMaintenance } from './queries/helpers/runMaintenance';

if (self.constructor.name !== 'DedicatedWorkerGlobalScope') {
  throw new Error(`worker is executing outside a worker context (is: "${self.constructor.name}")`);
}

export class ItemsSourceApi implements WithDb{
  constructor(
    public readonly db: PreparedDb,
  ) {}
}

Object.assign(ItemsSourceApi.prototype, {
  runMaintenance,
  getStats,
  getUsages,

  getAllTags,
  getGroupItemsByGroupId,
  getHashesByGroupId,
  getImages,
  getImagesByHashes,
  getImagesByAnyHashes,
  updateImages,
  deleteImagesByHashes,

  getImageGroupsFullTree,
  getImageGroupsList,
  updateImageGroups,
  deleteImageGroupsByIds,

  getFrames,
  getFramesByHashes,
  getFramesByIds,
  updateFrames,
  deleteFramesByIds,

  getFrameGroups,
  updateFrameGroups,
  deleteFrameGroupsByIds,

  getPalettes,
  getPalettesByShortNames,
  updatePalettes,
  deletePalettesByShortNames,

  getPlugins,
  getPluginsByUrls,
  updatePlugins,
  deletePluginsByUrls,

  getBinaryFramesByHashes,
  getBinaryFrameHashes,
  updateBinaryFrames,
  deleteBinaryFramesByHashes,

  getBinaryImagesByHashes,
  getBinaryImageHashes,
  updateBinaryImages,
  deleteBinaryImagesByHashes,
});

const init: InitWorkerFn = async (hostApi: ItemsHostApi) => {
  const db = await openAndPrepareDb(hostApi);
  const instance = new ItemsSourceApi(db) as unknown as ItemsSource;
  return Comlink.proxy(instance);
};

Comlink.expose(init);
