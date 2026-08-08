import z from 'zod';

export const FrameGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type FrameGroup = z.infer<typeof FrameGroupSchema>;
