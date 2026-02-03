import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useItemsStore } from '@/stores/stores';
import type { Plugin } from '@/types/Plugin';
import PluginInputField from './PluginInputField';

interface Props extends Plugin {
  pluginIndex: number;
}

function PluginConfig(props: Props) {
  const { deletePlugin, updatePluginConfig } = useItemsStore();
  const t = useTranslations('SettingsPlugins');

  const {
    url,
    name,
    description,
    configParams = {},
    config = {},
    error,
    loading,
    pluginIndex,
  } = props;

  return (
    <Card
      raised
      component="li"
    >
      <CardHeader
        title={(
          <Stack
            direction="row"
            gap={2}
          >
            <Typography variant="h3" component="h3">
              {name}
            </Typography>
            {loading && <CircularProgress color="secondary" size={22} />}
          </Stack>
        )}
        subheader={(
          <>
            <Typography variant="body2" component="div">
              {description}
            </Typography>
            <Typography variant="caption" component="div">
              {url}
            </Typography>
          </>
        )}
        action={(
          <IconButton
            title={t('deletePlugin', { name: name || '' })}
            onClick={() => deletePlugin(url)}
          >
            <DeleteIcon />
          </IconButton>
        )}
      />

      <CardContent>
        <Stack
          direction="column"
          gap={4}
        >
          {error && (
            <Alert
              severity="warning"
              icon={<WarningIcon fontSize="inherit" color="warning" />}
            >
              {error}
            </Alert>
          )}

          {Object.keys(configParams).map((fieldName) => (
            <PluginInputField
              key={`${fieldName}-${pluginIndex}`}
              id={`${fieldName}-${pluginIndex}`}
              label={configParams[fieldName].label}
              type={configParams[fieldName].type}
              value={config[fieldName]}
              onChange={(value: string | number) => {
                updatePluginConfig(url, fieldName, value);
              }}
            />
          ))}
        </Stack>
      </CardContent>

    </Card>
  );
}

export default PluginConfig;
