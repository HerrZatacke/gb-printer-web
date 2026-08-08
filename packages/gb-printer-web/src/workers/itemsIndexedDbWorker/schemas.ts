import {
  PaletteSchema,
  Date,
  toCreationDate,
  SerializableImageGroupSchema,
  FrameSchema,
  FrameGroupSchema,
  PluginSchema,
  ImageSchema,
  type Image,
} from 'gb-printer-schemas';
import z from 'zod';
import { SpecialTags } from '@/consts/SpecialTags';
import { BinaryStoreItemSchema } from '@/types/BinaryStoreItem';

const DAY_MS = 24 * 60 * 60 * 1000;

export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const;
export const SortDirectionSchema = z.enum(SortDirection);
export type SortDirection = z.infer<typeof SortDirectionSchema>;

export const ImageSortField = {
  CREATED: 'created',
  FRAME: 'frame',
  PALETTE: 'palette',
  TITLE: 'title',
} as const;
export const ImageSortFieldSchema = z.enum(ImageSortField);
export type ImageSortField = z.infer<typeof ImageSortFieldSchema>;

const calculateSpecialTags = (image: Image): SpecialTags[] => {
  const specialTags: SpecialTags[] = [];
  const oneDayAgo = toCreationDate(Date.now() - DAY_MS);

  if (!image.tags.length) {
    specialTags.push(SpecialTags.FILTER_UNTAGGED);
  }

  if (image.created > oneDayAgo) {
    specialTags.push(SpecialTags.FILTER_NEW);
  }

  if (image.type === 'mono') {
    specialTags.push(SpecialTags.FILTER_MONOCHROME);
  }

  if (image.type === 'rgbn') {
    specialTags.push(SpecialTags.FILTER_RGB);
  }

  if (image.tags.includes(SpecialTags.FILTER_FAVOURITE)) {
    specialTags.push(SpecialTags.FILTER_FAVOURITE);
  }

  if (image.meta?.comment) {
    specialTags.push(SpecialTags.FILTER_COMMENTS);
  }

  if (image.meta?.userName) {
    specialTags.push(SpecialTags.FILTER_USERNAME);
  }

  return specialTags;
};

export const StoredImageSchema = ImageSchema.transform((image) => {
  const referencedHashes: string[] = image.type === 'rgbn'
    ? Object.values(image.hashes ?? {}).filter((h): h is string => Boolean(h))
    : [];

  return ({
    ...image,
    referencedHashes,
    specialTags: calculateSpecialTags(image),
  });
});

export const StoredSerializableImageGroupSchema = SerializableImageGroupSchema.extend({
  specialTags: z.array(z.enum(SpecialTags)).prefault([]),
  palettes: z.array(z.string()).prefault([]),
  frames: z.array(z.string()).prefault([]),
});

const GroupItemBaseSchema = z.object({
  title: z.string(),
  created: z.string(),
  frame: z.string().nullable(),
  palette: z.string().nullable(),
});

export const GroupItemImageSchema = GroupItemBaseSchema.extend({
  type: z.literal('image'),
  image: ImageSchema,
});

export const GroupItemGroupSchema = GroupItemBaseSchema.extend({
  type: z.literal('group'),
  group: SerializableImageGroupSchema,
});

export const GroupItemSchema = z.discriminatedUnion('type', [
  GroupItemImageSchema,
  GroupItemGroupSchema,
]);

export const ItemsReferenceListSchema = <T extends z.ZodType>(itemSchema: T) => {
  return z.object({
    reference: z.string(),
    items: z.array(itemSchema),
  });
};

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

export const GetImagesByAnyHashesParamsSchema = z.object({
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

export const GetFramesByHashesParamsSchema = z.object({
  hashes: z.array(z.string()).min(1),
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
