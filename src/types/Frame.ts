import z from 'zod';

export const FrameSchema = z.object({
  id: z.string(),
  hash: z.string(),
  name: z.string(),
  lines: z.number().catch(360),
  tempId: z.string().optional(),
});

export type Frame = z.infer<typeof FrameSchema>;
