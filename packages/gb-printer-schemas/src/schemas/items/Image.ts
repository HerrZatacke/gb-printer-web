import { BlendMode, type RGBNPalette as DecoderLibRGBNPalette, Rotation } from 'gb-image-decoder';
import z from 'zod';
import { fromCreationDate, toCreationDate } from '@/tools/creationDate';

const nullToValue = <T extends z.ZodType>(schema: T, defaultValue: undefined | z.input<T>) => {
  return z.preprocess((val) => (val === null ? defaultValue : val), schema.optional());
};

export const ImageMetadataSchema = z.object({
  romType: z.string().optional(),
  userId: z.string().optional(),
  birthDate: z.string().optional(),
  userName: z.string().optional(),
  gender: z.string().optional(),
  bloodType: z.string().optional(),
  comment: z.string().optional(),
  isCopy: z.boolean().optional(),
  exposure: z.string().optional(),
  captureMode: z.string().optional(),
  edgeExclusive: z.string().optional(),
  edgeOperation: z.string().optional(),
  gain: z.string().optional(),
  edgeMode: z.string().optional(),
  invertOut: z.string().optional(),
  voltageRef: z.string().optional(),
  zeroPoint: z.string().optional(),
  vOut: z.string().optional(),
})
  .catchall(z.unknown()); // zod equivalent to Record<string, unknown>

export type ImageMetadata = z.infer<typeof ImageMetadataSchema>;

export const CommonImageSchema = z.object({
  hash: z.string(),
  created: z.string().transform((value, ctx) => {
    try {
      return toCreationDate(fromCreationDate(value));
    } catch (error) {
      ctx.addIssue({
        code: 'custom',
        message: error instanceof Error ? error.message : 'Invalid creation date',
      });
      return z.NEVER;
    }
  }),
  title: z.string(),
  frame: z.string().optional().catch(undefined),
  tags: z.array(z.string()).catch([]),
  lockFrame: z.boolean().prefault(false),
  rotation: nullToValue(z.enum(Rotation), Rotation.DEG_0),
  meta: nullToValue(ImageMetadataSchema, undefined),
});

export type CommonImage = z.infer<typeof CommonImageSchema>;

export const RGBNHashesSchema = z.object({
  r: z.string().optional(),
  g: z.string().optional(),
  b: z.string().optional(),
  n: z.string().optional(),
});

export type RGBNHashes = z.infer<typeof RGBNHashesSchema>;

const RGBNPaletteSchema = z.object({
  r: z.array(z.number()).optional(),
  g: z.array(z.number()).optional(),
  b: z.array(z.number()).optional(),
  n: z.array(z.number()).optional(),
  blend: nullToValue(z.enum(BlendMode), undefined).catch(undefined),
}) satisfies z.ZodType<DecoderLibRGBNPalette>;

export type RGBNPalette = z.infer<typeof RGBNPaletteSchema>;

export const RGBNImageSchema = CommonImageSchema.extend({
  type: z.literal('rgbn'),
  palette: RGBNPaletteSchema,
  hashes: RGBNHashesSchema,
});

export type RGBNImage = z.infer<typeof RGBNImageSchema>;

export const MonochromeImageSchema = CommonImageSchema.extend({
  type: z.literal('mono'),
  lines: z.number(),
  palette: z.string().optional().catch(undefined),
  invertPalette: z.boolean().prefault(false),
  framePalette: z.string().optional().catch(undefined),
  invertFramePalette: z.boolean().prefault(false),
});

export type MonochromeImage = z.infer<typeof MonochromeImageSchema>;


type RawImageInput = {
  type?: string;
  hashes?: string[];
  [key: string]: unknown;
};

type PreprocessedImage = z.input<typeof MonochromeImageSchema> | z.input<typeof RGBNImageSchema>;

export const ImageSchema = z.preprocess((val: RawImageInput): PreprocessedImage => {
  if (val.type) {
    return val as PreprocessedImage;
  }
  return {
    ...val,
    type: val.hashes ? 'rgbn' : 'mono',
  } as unknown as PreprocessedImage;
}, z.discriminatedUnion('type', [MonochromeImageSchema, RGBNImageSchema]));

export type Image = z.infer<typeof ImageSchema>;

export interface CurrentEditBatch {
  batch?: string[];
  tags?: string[];
}
