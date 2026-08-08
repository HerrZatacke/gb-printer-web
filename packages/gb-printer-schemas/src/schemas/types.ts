import z from 'zod';
import {
  GroupItemGroupSchema,
  GroupItemImageSchema,
  GroupItemSchema,
} from '@/schemas/items/GroupItem';
import { StoredImageSchema } from '@/schemas/items/Image';
import { StoredSerializableImageGroupSchema } from '@/schemas/items/ImageGroup';
import {
  DeleteBinaryItemsByHashesParamsSchema,
  DeleteFrameGroupsByIdsParamsSchema,
  DeleteFramesByIdsParamsSchema,
  DeleteImageGroupsByIdsParamsSchema,
  DeleteImagesByHashesParamsSchema,
  DeletePalettesByShortNamesParamsSchema,
  DeletePluginsByUrlsParamsSchema,
  GetBinaryItemsByHashesParamsSchema,
  GetFramesByHashesParamsSchema,
  GetFramesByIdsParamsSchema,
  GetGroupItemsByGroupIdParamsSchema,
  GetHashesByGroupIdParamsSchema,
  GetImagesByAnyHashesParamsSchema,
  GetImagesByHashesParamsSchema,
  GetImagesParamsSchema,
  GetPalettesByShortNamesParamsSchema,
  GetPluginsByUrlsParamsSchema,
  ImageQueryFiltersSchema,
  ImageQueryParamsSchema,
  ImageQuerySortSchema,
  UpdateBinaryItemsParamsSchema,
  UpdateFrameGroupsParamsSchema,
  UpdateFramesParamsSchema,
  UpdateImageGroupsParamsSchema,
  UpdateImagesParamsSchema,
  UpdatePalettesParamsSchema,
  UpdatePluginsParamsSchema,
} from './api/QueryParams';

export type StoredImage = z.infer<typeof StoredImageSchema>;
export type StoredSerializableImageGroup = z.infer<typeof StoredSerializableImageGroupSchema>;
export type GroupItemImage = z.infer<typeof GroupItemImageSchema>;
export type GroupItemGroup = z.infer<typeof GroupItemGroupSchema>;
export type GroupItem = z.infer<typeof GroupItemSchema>;
export type ImageQueryFilters = z.infer<typeof ImageQueryFiltersSchema>;
export type ImageQuerySort = z.infer<typeof ImageQuerySortSchema>;
export type ImageQueryParams = z.infer<typeof ImageQueryParamsSchema>;
export type GetGroupItemsByGroupIdParams = z.infer<typeof GetGroupItemsByGroupIdParamsSchema>;
export type GetHashesByGroupIdParams = z.infer<typeof GetHashesByGroupIdParamsSchema>;
export type GetImagesParams = z.infer<typeof GetImagesParamsSchema>;
export type GetImagesByHashesParams = z.infer<typeof GetImagesByHashesParamsSchema>;
export type GetImagesByAnyHashesParams = z.infer<typeof GetImagesByAnyHashesParamsSchema>;
export type UpdateImagesParams = z.infer<typeof UpdateImagesParamsSchema>;
export type DeleteImagesByHashesParams = z.infer<typeof DeleteImagesByHashesParamsSchema>;
export type UpdateImageGroupsParams = z.infer<typeof UpdateImageGroupsParamsSchema>;
export type DeleteImageGroupsByIdsParams = z.infer<typeof DeleteImageGroupsByIdsParamsSchema>;
export type GetFramesByHashesParams = z.infer<typeof GetFramesByHashesParamsSchema>;
export type GetFramesByIdsParams = z.infer<typeof GetFramesByIdsParamsSchema>;
export type UpdateFramesParams = z.infer<typeof UpdateFramesParamsSchema>;
export type DeleteFramesByIdsParams = z.infer<typeof DeleteFramesByIdsParamsSchema>;
export type UpdateFrameGroupsParams = z.infer<typeof UpdateFrameGroupsParamsSchema>;
export type DeleteFrameGroupsByIdsParams = z.infer<typeof DeleteFrameGroupsByIdsParamsSchema>;
export type GetPalettesByShortNamesParams = z.infer<typeof GetPalettesByShortNamesParamsSchema>;
export type UpdatePalettesParams = z.infer<typeof UpdatePalettesParamsSchema>;
export type DeletePalettesByShortNamesParams = z.infer<typeof DeletePalettesByShortNamesParamsSchema>;
export type GetPluginsByUrlsParams = z.infer<typeof GetPluginsByUrlsParamsSchema>;
export type UpdatePluginsParams = z.infer<typeof UpdatePluginsParamsSchema>;
export type DeletePluginsByUrlsParams = z.infer<typeof DeletePluginsByUrlsParamsSchema>;
export type GetBinaryItemsByHashesParams = z.infer<typeof GetBinaryItemsByHashesParamsSchema>;
export type UpdateBinaryItemsParams = z.infer<typeof UpdateBinaryItemsParamsSchema>;
export type DeleteBinaryItemsByHashesParams = z.infer<typeof DeleteBinaryItemsByHashesParamsSchema>;
