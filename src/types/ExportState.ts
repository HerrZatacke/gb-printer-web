import z from 'zod';
import { FrameSchema } from '@/types/Frame';
import { FrameGroupSchema } from '@/types/FrameGroup';
import { ImageSchema } from '@/types/Image';
import { NewSerializableImageGroupSchema } from '@/types/ImageGroup';
import { PaletteSchema } from '@/types/Palette';
import { PluginSchema } from '@/types/Plugin';

export const ExportableValuesSchema = z.object({
  frames: z.array(FrameSchema),
  frameGroups: z.array(FrameGroupSchema),
  palettes: z.array(PaletteSchema),
  plugins: z.array(PluginSchema),
  images: z.array(ImageSchema),
  imageGroups: z.array(NewSerializableImageGroupSchema),
});

export type ExportableValues = z.infer<typeof ExportableValuesSchema>;

// ToDo: extend this to a schema for merging
export interface ExportableState extends Partial<ExportableValues> {
  lastUpdateUTC: number;
  version: number;
}

// ToDo: extend this to a schema for merging
export interface JSONExportState {
  state: ExportableState;
}

// ToDo: extend this to a schema for merging
export interface JSONExportBinary {
  [k: string]: string;
}

// ToDo: extend this to a schema for merging
export type JSONExport = JSONExportState & JSONExportBinary;
