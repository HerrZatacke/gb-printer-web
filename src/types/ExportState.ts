import z from 'zod';
import { FrameSchema } from '@/types/Frame';
import { FrameGroupSchema } from '@/types/FrameGroup';
import { ImageSchema } from '@/types/Image';
import { SerializableImageGroupSchema } from '@/types/ImageGroup';
import { PaletteSchema } from '@/types/Palette';
import { PluginSchema } from '@/types/Plugin';

export const ExportableValuesSchema = z.object({
  frames: z.array(FrameSchema).optional(),
  frameGroups: z.array(FrameGroupSchema).optional(),
  palettes: z.array(PaletteSchema).optional(),
  plugins: z.array(PluginSchema).optional(),
  images: z.array(ImageSchema).optional(),
  imageGroups: z.array(SerializableImageGroupSchema).optional(),
});

export const ExportableStateSchema = ExportableValuesSchema.extend({
  lastUpdateUTC: z.number().prefault(0),
  version: z.number().prefault(0),
});

const stripIrrelevantValues = (obj: Record<string, unknown>): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => (
      value !== null
      && value !== undefined
    )),
  );
};

export const JSONExportSchema = z.preprocess(
  stripIrrelevantValues,
  z.object({
    state: ExportableStateSchema,
  })
    .catchall(z.string()),
);

export type ExportableValues = z.infer<typeof ExportableValuesSchema>;
export type ExportableState = z.infer<typeof ExportableStateSchema>;
export type JSONExport = z.infer<typeof JSONExportSchema>;

export const createJSONExport = (
  state: ExportableState,
  binaries: Record<string, string>,
): JSONExport => {
  return JSONExportSchema.parse({
    state,
    ...binaries,
  });
};
