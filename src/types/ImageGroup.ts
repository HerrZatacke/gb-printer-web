import z from 'zod';

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
  fullSlug: string;
}

export const NewTreeImageGroupSchema: z.ZodType<NewTreeImageGroup> = NewBaseImageGroupSchema.extend({
  get groups() {
    return z.array(NewTreeImageGroupSchema);
  },
  totalImages: z.number(),
  fullSlug: z.string(),
});
