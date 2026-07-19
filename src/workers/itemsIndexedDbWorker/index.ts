import * as Comlink from 'comlink';
import { configureDb } from '@/workers/itemsIndexedDbWorker/db';
import { getFrameDataByHashes, getImageDataByHashes } from '@/workers/itemsIndexedDbWorker/queries/binaryData';
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

if (self.constructor.name !== 'DedicatedWorkerGlobalScope') {
  throw new Error(`worker is executing outside a worker context (is: "${self.constructor.name}")`);
}

const api: ItemsSource = {
  init: configureDb,

  getFrameDataByHashes,
  getImageDataByHashes,

  getAllTags,
  getGroupItemsByGroupId,
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
};

Comlink.expose(api);
