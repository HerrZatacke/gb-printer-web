import * as Comlink from 'comlink';
import { configureDb } from '@/workers/itemsIndexedDbWorker/db';
import { getFrameDataByHashes, getImageDataByHashes } from '@/workers/itemsIndexedDbWorker/queries/binaryData';
import { getFrameGroups } from '@/workers/itemsIndexedDbWorker/queries/frameGroups';
import { getFramesByIds, getFrames } from '@/workers/itemsIndexedDbWorker/queries/frames';
import { getImageGroups } from '@/workers/itemsIndexedDbWorker/queries/imageGroups';
import { getImagesByHashes, getImages } from '@/workers/itemsIndexedDbWorker/queries/images';
import { getPalettes, getPalettesByShortName } from '@/workers/itemsIndexedDbWorker/queries/palettes';
import { getPluginsByUrls, getPlugins } from '@/workers/itemsIndexedDbWorker/queries/plugins';
import { type ItemsSource } from '@/workers/itemsIndexedDbWorker/types';

const api: ItemsSource = {
  init: configureDb,

  getFrameDataByHashes,
  getImageDataByHashes,

  getImages,
  getImagesByHashes,

  getImageGroups,

  getFrames,
  getFramesByIds,

  getFrameGroups,

  getPalettes,
  getPalettesByShortName,

  getPlugins,
  getPluginsByUrls,
};

Comlink.expose(api);
