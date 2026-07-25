import z from 'zod';

export const BinaryStoreItemSchema = z.object({
  hash: z.string(),
  data: z.string(),
});

export type BinaryStoreItem = z.infer<typeof BinaryStoreItemSchema>;
