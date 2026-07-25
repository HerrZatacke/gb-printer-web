import z from 'zod';

export const BinaryImageSchema = z.object({
  hash: z.string(),
  imageData: z.string(),
});

export type BinaryImage = z.infer<typeof BinaryImageSchema>;
