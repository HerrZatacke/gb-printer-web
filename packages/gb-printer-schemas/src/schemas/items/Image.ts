import { BlendMode, type RGBNPalette as DecoderLibRGBNPalette, Rotation } from 'gb-image-decoder';
import z from 'zod';
import { fromCreationDate, toCreationDate } from '@/tools/creationDate';
import { Date } from '@/tools/safeDate';
import { DAY_MS, SpecialTags } from '../api/consts';

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
  frame: z.string().nullable().catch(null),
  tags: z.array(z.string()).catch([]),
  lockFrame: z.boolean().prefault(false),
  rotation: z.enum(Rotation).catch(Rotation.DEG_0),
  meta: ImageMetadataSchema.nullable().catch(null),
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
  blend: z.enum(BlendMode).optional().catch(undefined),
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
  palette: z.string().nullable().catch(null),
  invertPalette: z.boolean().prefault(false),
  framePalette: z.string().nullable().catch(null),
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

export const calculateSpecialTags = (image: Image): SpecialTags[] => {
  const specialTags: SpecialTags[] = [];
  const oneDayAgo = toCreationDate(Date.now() - DAY_MS);

  if (!image.tags.length) {
    specialTags.push(SpecialTags.FILTER_UNTAGGED);
  }

  if (image.created > oneDayAgo) {
    specialTags.push(SpecialTags.FILTER_NEW);
  }

  if (image.type === 'mono') {
    specialTags.push(SpecialTags.FILTER_MONOCHROME);
  }

  if (image.type === 'rgbn') {
    specialTags.push(SpecialTags.FILTER_RGB);
  }

  if (image.tags.includes(SpecialTags.FILTER_FAVOURITE)) {
    specialTags.push(SpecialTags.FILTER_FAVOURITE);
  }

  if (image.meta?.comment) {
    specialTags.push(SpecialTags.FILTER_COMMENTS);
  }

  if (image.meta?.userName) {
    specialTags.push(SpecialTags.FILTER_USERNAME);
  }

  return specialTags;
};

export const StoredImageSchema = ImageSchema.transform((image) => {
  const referencedHashes: string[] = image.type === 'rgbn'
    ? Object.values(image.hashes ?? {}).filter((h): h is string => Boolean(h))
    : [];

  return ({
    ...image,
    referencedHashes,
    specialTags: calculateSpecialTags(image),
  });
});
