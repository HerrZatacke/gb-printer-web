import z from 'zod';
import { SpecialTags } from '@/consts/SpecialTags';
import { Date } from '@/tools/safeDate';
import { toCreationDate } from '@/tools/toCreationDate';
import {
  type Image,
  ImageSchema,
  MonochromeImageSchema,
  RGBNImageSchema,
} from '@/types/Image';
import {
  SerializableImageGroupSchema,
} from '@/types/ImageGroup';

const DAY_MS = 24 * 60 * 60 * 1000;

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

export const StoredImageSchema = z.discriminatedUnion('type', [
  MonochromeImageSchema,
  RGBNImageSchema,
]).transform((image) => {

  const referencedHashes: string[] = image.type === 'rgbn'
    ? Object.values(image.hashes ?? {}).filter((h): h is string => Boolean(h))
    : [];

  return ({
    ...image,
    referencedHashes,
    specialTags: calculateSpecialTags(image),
  });
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


