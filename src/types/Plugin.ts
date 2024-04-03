enum ConfigParamType {
  NUMBER = 'number',
  STRING = 'string',
  MULTILINE = 'multiline',
}

interface ConfigParam {
  label: string,
  type: ConfigParamType,
}

type PluginConfigParams = Record<string, ConfigParam>;
type PluginConfigValues = Record<string, number | string>;

export interface Plugin {
  url: string
  config?: PluginConfigValues,
  name?: string
  description?: string
  loading?: boolean
  error?: string | false
  configParams?: PluginConfigParams,
}
