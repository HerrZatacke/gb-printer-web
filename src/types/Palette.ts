import { type GbPalette } from 'gb-palettes';
import z from 'zod';

const GbPaletteSchema = z.object({
  shortName: z.string(),
  name: z.string(),
  palette: z.array(z.string()),
  origin: z.string().prefault(''),
}) satisfies z.ZodType<GbPalette>;

export const PaletteSchema = GbPaletteSchema.extend({
  isPredefined: z.boolean().prefault(false),
});

export type Palette = z.infer<typeof PaletteSchema>;
