import z from 'zod';

export const ConfigParamType = {
  NUMBER: 'number',
  STRING: 'string',
  MULTILINE: 'multiline',
} as const;
export type ConfigParamType = (typeof ConfigParamType)[keyof typeof ConfigParamType];

export const ConfigParamSchema = z.object({
  label: z.string(),
  type: z.enum(ConfigParamType),
});

export type ConfigParam = z.infer<typeof ConfigParamSchema>;

export const PluginConfigParamsSchema = z.partialRecord(
  z.string(),
  ConfigParamSchema,
).default({});
export type PluginConfigParams = z.infer<typeof PluginConfigParamsSchema>;

export const PluginConfigValuesSchema = z.partialRecord(
  z.string(),
  z.union([z.number(), z.string()],
  )).default({});
export type PluginConfigValues = z.infer<typeof PluginConfigValuesSchema>;

export const PluginSchema = z.object({
  url: z.string(),
  config: PluginConfigValuesSchema.optional(),
  name: z.string().prefault(''),
  description: z.string().prefault(''),
  // loading: z.boolean().optional(),
  // error: z.union([z.string(), z.literal(false)]).optional(),
  configParams: PluginConfigParamsSchema.optional(),
});

export type Plugin = z.infer<typeof PluginSchema>;
