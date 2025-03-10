import React, { useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PluginConfig from './PluginConfig';
import useInteractionsStore from '../../../../stores/interactionsStore';
import useItemsStore from '../../../../stores/itemsStore';
import { usePluginsContext } from '../../../../contexts/plugins';
import { textFieldSlotDefaults } from '../../../../../consts/textFieldSlotDefaults';


function PluginSettings() {
  const { plugins } = useItemsStore();
  const { setError } = useInteractionsStore();
  const { validateAndAddPlugin } = usePluginsContext();
  const [pluginUrl, setPluginUrl] = useState('');
  const [addBusy, setAddBusy] = useState(false);

  return (
    <Stack
      direction="column"
      gap={6}
    >
      <TextField
        id="plugin-settings-add-plugin"
        label="Add Plugin"
        helperText={(
          <Link
            rel="noreferrer noopener nofollow"
            href="https://herrzatacke.github.io/gb-printer-web-plugins/"
            target="_blank"
          >
            🔗 A selection plugins can be found here
          </Link>
        )}
        type="text"
        fullWidth
        size="small"
        disabled={addBusy}
        value={pluginUrl}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
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
          Installed Plugins
        </Typography>

        <Stack
          direction="column"
          gap={2}
          component="ul"
        >
          {
            plugins.map((plugin, pluginIndex) => (
              <PluginConfig
                key={plugin.url}
                pluginIndex={pluginIndex}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...plugin}
              />
            ))
          }
        </Stack>
      </Stack>
    </Stack>
  );
}

export default PluginSettings;
