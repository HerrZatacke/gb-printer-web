import z from 'zod';

export const BaseImageGroupSchema = z.object({
  id: z.string(),
  slug: z.string(),
  created: z.string(),
  title: z.string(),
  isFavourite: z.boolean().prefault(false),
  coverImage: z.string().nullable(),
  images: z.array(z.string()).transform((images) => ([
    ...new Set(images),
  ])),
  tags: z.array(z.string()).prefault([]),
});

export type BaseImageGroup = z.infer<typeof BaseImageGroupSchema>;

export const SerializableImageGroupSchema = BaseImageGroupSchema.extend({
  groups: z.array(z.string()),
});

export type SerializableImageGroup = z.infer<typeof SerializableImageGroupSchema>;

export interface TreeImageGroup extends BaseImageGroup {
  groups: TreeImageGroup[];
  totalImages: number;
  fullSlug: string;
}

export const TreeImageGroupSchema: z.ZodType<TreeImageGroup> = BaseImageGroupSchema.extend({
  get groups() {
    return z.array(TreeImageGroupSchema);
  },
  totalImages: z.number(),
  fullSlug: z.string(),
});
