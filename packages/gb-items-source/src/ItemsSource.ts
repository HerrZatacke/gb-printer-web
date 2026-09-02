import {
  deleteBinaryFramesByHashes,
  getBinaryFrameHashes,
  getBinaryFramesByHashes,
  updateBinaryFrames,
  getOrphanedFrameHashes,
} from '@/queries/binaryFrames';
import {
  deleteBinaryImagesByHashes,
  getBinaryImageHashes,
  getBinaryImagesByHashes,
  updateBinaryImages,
  getOrphanedImageHashes,
} from '@/queries/binaryImages';
import {
  deleteFrameGroupsByIds,
  getFrameGroups,
  updateFrameGroups,
} from '@/queries/frameGroups';
import {
  deleteFramesByIds,
  getFrames,
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
  updateImages,
  deleteImagesByHashes,

  getImageGroupsFullTree,
  getImageGroupsList,
  updateImageGroups,
  deleteImageGroupsByIds,

  getFrames,
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
  getOrphanedFrameHashes,

  getBinaryImagesByHashes,
  getBinaryImageHashes,
  updateBinaryImages,
  deleteBinaryImagesByHashes,
  getOrphanedImageHashes,
});

