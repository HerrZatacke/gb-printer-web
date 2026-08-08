import z from 'zod';

export const ItemsReferenceListSchema = <T extends z.ZodType>(itemSchema: T) => {
  return z.object({
    reference: z.string(),
    items: z.array(itemSchema),
  });
};
