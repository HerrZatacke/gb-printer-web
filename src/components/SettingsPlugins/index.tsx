'use client';

import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { textFieldSlotDefaults } from '@/consts/textFieldSlotDefaults';
import { usePluginsContext } from '@/contexts/plugins';
import useInteractionsStore from '@/stores/interactionsStore';
import useItemsStore from '@/stores/itemsStore';
import PluginConfig from './PluginConfig';


function SettingsPlugins() {
  const { plugins } = useItemsStore();
  const { setError } = useInteractionsStore();
  const { validateAndAddPlugin } = usePluginsContext();
  const [pluginUrl, setPluginUrl] = useState('');
  const [addBusy, setAddBusy] = useState(false);
  const t = useTranslations('SettingsPlugins');

  return (
    <Stack
      direction="column"
      gap={10}
    >
      <TextField
        id="plugin-settings-add-plugin"
        label={t('addPlugin')}
        helperText={(
          <Link
            rel="noreferrer noopener nofollow"
            href="https://herrzatacke.github.io/gb-printer-web-plugins/"
            target="_blank"
          >
            🔗
            {t('addPluginHelper')}
          </Link>
        )}
        type="text"
        disabled={addBusy}
        value={pluginUrl}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton
                disabled={!pluginUrl || addBusy}
                onClick={async () => {
                  setAddBusy(true);
                  if (await validateAndAddPlugin({ url: pluginUrl })) {
                    setPluginUrl('');
                  } else {
                    setError(new Error('Could not install plugin.'));
                  }

                  setAddBusy(false);
                }}
              >
                <AddBoxIcon />
              </IconButton>
            ),
          },
          ...textFieldSlotDefaults,
        }}
        onChange={(ev) => {
          setPluginUrl(ev.target.value);
        }}
      />


      <Stack
        direction="column"
        gap={1}
      >
        <Typography component="h3" variant="h3">
          {t('installedPlugins')}
        </Typography>

        <Stack
          direction="column"
          gap={6}
          component="ul"
        >
          {
            plugins.map((plugin, pluginIndex) => (
              <PluginConfig
                key={plugin.url}
                pluginIndex={pluginIndex}

                {...plugin}
              />
            ))
          }
        </Stack>
      </Stack>
    </Stack>
  );
}

export default SettingsPlugins;
