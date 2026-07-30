import * as Comlink from 'comlink';
import { configureDb } from '@/workers/itemsIndexedDbWorker/db';
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
import { debugReset } from '@/workers/itemsIndexedDbWorker/queries/helpers/debug';
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
import { type ItemsSource } from '@/workers/itemsIndexedDbWorker/types';
import { getStats } from './queries/helpers/getStats';
import { runMaintenance } from './queries/helpers/runMaintenance';

if (self.constructor.name !== 'DedicatedWorkerGlobalScope') {
  throw new Error(`worker is executing outside a worker context (is: "${self.constructor.name}")`);
}

const api: ItemsSource = {
  init: configureDb,
  debugReset,
  runMaintenance,
  getStats,

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
};

Comlink.expose(api);
