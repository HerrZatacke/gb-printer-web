import {
  deleteBinaryFramesByHashes,
  getBinaryFrameHashes,
  getBinaryFramesByHashes,
  updateBinaryFrames,
} from '@/queries/binaryFrames';
import {
  deleteBinaryImagesByHashes,
  getBinaryImageHashes,
  getBinaryImagesByHashes,
  updateBinaryImages,
} from '@/queries/binaryImages';
import {
  deleteFrameGroupsByIds,
  getFrameGroups,
  updateFrameGroups,
} from '@/queries/frameGroups';
import {
  deleteFramesByIds,
  getFrames,
  getFramesByHashes,
  getFramesByIds,
  updateFrames,
} from '@/queries/frames';
import { getStats, getUsages } from '@/queries/helpers/getStats';
import { runMaintenance } from '@/queries/helpers/runMaintenance';
import {
  deleteImageGroupsByIds,
  getImageGroupsFullTree,
  getImageGroupsList,
  updateImageGroups,
} from '@/queries/imageGroups';
import {
  deleteImagesByHashes,
  getAllTags,
  getGroupItemsByGroupId,
  getHashesByGroupId,
  getImagesByHashes,
  getImagesByAnyHashes,
  getImages,
  updateImages,
} from '@/queries/images';
import {
  deletePalettesByShortNames,
  getPalettes,
  getPalettesByShortNames,
  updatePalettes,
} from '@/queries/palettes';
import {
  deletePluginsByUrls,
  getPlugins,
  getPluginsByUrls,
  updatePlugins,
} from '@/queries/plugins';
import {
  type WithRepositories,
  type Repositories,
} from '@/types';

export class ItemsSourceApi implements WithRepositories {
  constructor(
    public readonly repositories: Repositories,
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

