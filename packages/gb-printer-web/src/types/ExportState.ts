import { PaletteSchema , ImageSchema } from 'gb-printer-schemas';
import { SerializableImageGroupSchema } from 'gb-printer-schemas';
import hasher from 'object-hash';
import z from 'zod';
import { type Frame, FrameSchema } from '@/types/Frame';
import { FrameGroupSchema } from '@/types/FrameGroup';
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

export const OldFrameSchema = FrameSchema.extend({
  hash: z.string().optional(),
});

export type OldFrame = z.infer<typeof OldFrameSchema>;

const hasUnhashedFrames = (frames: OldFrame[]): boolean => (
  Boolean(frames.find(({ hash }) => !hash))
);

export const hashImportFrames = (rawState: Record<string, unknown>): Record<string, unknown> => {
  const { state, ...newBinaries } = rawState;

  const stateRecord = state as Record<string, unknown>;
  const oldFrames = (stateRecord.frames as OldFrame[]) || [];

  if (!oldFrames.length || !hasUnhashedFrames(oldFrames)) {
    return rawState;
  }

  const newFrames: Frame[] = oldFrames.map((frame: OldFrame): Frame => {
    if (frame.hash) {
      return frame as Frame;
    }

    const frameKey = `frame-${frame.id}`;

    const frameData = newBinaries[frameKey];

    if (!frameData) {
      throw new Error(`could not load ${frameKey} from json import`);
    }

    const hash = hasher(frameData);
    delete newBinaries[frameKey];
    newBinaries[`frame-${hash}`] = frameData;

    return {
      ...frame,
      hash,
    };
  });

  return {
    state: {
      ...stateRecord,
      frames: newFrames,
    },
    ...newBinaries,
  };
};


export const JSONExportSchema = z.preprocess(
  (raw: Record<string, unknown>) => {
    const strippedRaw = stripIrrelevantValues(raw);
    const withHashedFrames = hashImportFrames(strippedRaw);
    return withHashedFrames;
  },
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
