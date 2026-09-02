import z from 'zod';
import { BinaryStoreItemSchema } from '@/schemas/items/BinaryStoreItem';
import { FrameSchema } from '@/schemas/items/Frame';
import { FrameGroupSchema } from '@/schemas/items/FrameGroup';
import { ImageSchema } from '@/schemas/items/Image';
import { SerializableImageGroupSchema } from '@/schemas/items/ImageGroup';
import { PaletteSchema } from '@/schemas/items/Palette';
import { PluginSchema } from '@/schemas/items/Plugin';
import {
  ImageSortFieldSchema,
  SortDirectionSchema,
  SpecialTags,
} from './consts';

export const ImageQueryFiltersSchema = z.object({
  tags: z.array(z.union([z.string(), z.enum(SpecialTags)])).optional(),
  palette: z.array(z.string()).optional(),
  frame: z.array(z.string()).optional(),
});

export const ImageQuerySortSchema = z.object({
  field: ImageSortFieldSchema,
  direction: SortDirectionSchema,
});

export const ImageQueryParamsSchema = z.object({
  page: z.number().min(0),
  pageSize: z.number().min(0),
  filters: ImageQueryFiltersSchema.optional(),
  sort: ImageQuerySortSchema,
});

// API Endpoint Parameters
export const GetGroupItemsByGroupIdParamsSchema = z.object({
  groupId: z.string(),
  includeGroups: z.boolean(),
  params: ImageQueryParamsSchema,
});

export const GetHashesByGroupIdParamsSchema = z.object({
  groupId: z.string(),
  includeGroups: z.boolean(),
  sort: ImageQuerySortSchema,
  filters: ImageQueryFiltersSchema.optional(),
});

export const GetImagesParamsSchema = z.object({
  params: ImageQueryParamsSchema,
  candidateHashes: z.set(z.string()).optional(),
});

export const GetImagesByHashesParamsSchema = z.object({
  hashes: z.array(z.string()).min(1),
});

export const UpdateImagesParamsSchema = z.object({
  images: z.array(ImageSchema),
  purge: z.boolean(),
});

export const DeleteImagesByHashesParamsSchema = z.object({
  hashes: z.array(z.string()).min(1),
});

export const UpdateImageGroupsParamsSchema = z.object({
  imageGroups: z.array(SerializableImageGroupSchema),
  purge: z.boolean(),
});

export const DeleteImageGroupsByIdsParamsSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export const GetFramesByIdsParamsSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export const UpdateFramesParamsSchema = z.object({
  frames: z.array(FrameSchema),
  purge: z.boolean(),
});

export const DeleteFramesByIdsParamsSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export const UpdateFrameGroupsParamsSchema = z.object({
  frameGroups: z.array(FrameGroupSchema),
  purge: z.boolean(),
});

export const DeleteFrameGroupsByIdsParamsSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export const GetPalettesByShortNamesParamsSchema = z.object({
  shortNames: z.array(z.string()).min(1),
});

export const UpdatePalettesParamsSchema = z.object({
  palettes: z.array(PaletteSchema),
  purge: z.boolean(),
});

export const DeletePalettesByShortNamesParamsSchema = z.object({
  shortNames: z.array(z.string()).min(1),
});

export const GetPluginsByUrlsParamsSchema = z.object({
  urls: z.array(z.string()).min(1),
});

export const UpdatePluginsParamsSchema = z.object({
  plugins: z.array(PluginSchema),
  purge: z.boolean(),
});

export const DeletePluginsByUrlsParamsSchema = z.object({
  urls: z.array(z.string()).min(1),
});

export const GetBinaryItemsByHashesParamsSchema = z.object({
  hashes: z.array(z.string()).min(1),
});

export const UpdateBinaryItemsParamsSchema = z.object({
  items: z.array(BinaryStoreItemSchema).min(1),
});

export const DeleteBinaryItemsByHashesParamsSchema = z.object({
  hashes: z.array(z.string()).min(1),
});
