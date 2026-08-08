import z from 'zod';
import { ImageSchema } from '@/schemas/items/Image';
import { SerializableImageGroupSchema } from '@/schemas/items/ImageGroup';

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
