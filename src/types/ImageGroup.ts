import z from 'zod';
import { type Image, ImageSchema } from './Image';

export const BaseImageGroupSchema = z.object({
  id: z.string(),
  slug: z.string(),
  created: z.string(),
  title: z.string(),
  isFavourite: z.boolean().prefault(false),
  coverImage: z.string(),
});

export type BaseImageGroup = z.infer<typeof BaseImageGroupSchema>;

export const SerializableImageGroupSchema = BaseImageGroupSchema.extend({
  groups: z.array(z.string()),
  images: z.array(z.string()),
});

export type SerializableImageGroup = z.infer<typeof SerializableImageGroupSchema>;

export interface TreeImageGroup extends BaseImageGroup {
  images: Image[];
  tags: string[];
  allImages: Image[];
  groups: TreeImageGroup[];
}

export const TreeImageGroupSchema: z.ZodType<TreeImageGroup> = BaseImageGroupSchema.extend({
  images: z.array(ImageSchema),
  tags: z.array(z.string()),
  allImages: z.array(ImageSchema),
  get groups() {
    return z.array(TreeImageGroupSchema);
  },
});


 /* ********* During migration added New-Prefix *************************  */

export const NewBaseImageGroupSchema = z.object({
  id: z.string(),
  slug: z.string(),
  created: z.string(),
  title: z.string(),
  isFavourite: z.boolean().prefault(false),
  coverImage: z.string(),
  images: z.array(z.string()),
  tags: z.array(z.string()).prefault([]),
});

export type NewBaseImageGroup = z.infer<typeof NewBaseImageGroupSchema>;

export const NewSerializableImageGroupSchema = NewBaseImageGroupSchema.extend({
  groups: z.array(z.string()),
});

export type NewSerializableImageGroup = z.infer<typeof NewSerializableImageGroupSchema>;

export interface NewTreeImageGroup extends NewBaseImageGroup {
  groups: NewTreeImageGroup[];
  totalImages: number;
}

export const NewTreeImageGroupSchema: z.ZodType<NewTreeImageGroup> = NewBaseImageGroupSchema.extend({
  get groups() {
    return z.array(NewTreeImageGroupSchema);
  },
  totalImages: z.number(),
});
