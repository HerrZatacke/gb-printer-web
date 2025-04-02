import React, { useEffect, useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import APConfig from './APConfig';
import { textFieldSlotDefaults } from '../../../../../consts/textFieldSlotDefaults';
import { useAsPasswordField } from '../../../../../hooks/useAsPasswordField';

interface WiFiNetwork {
  psk: string,
  ssid: string,
  delete?: boolean,
  isNew?: boolean,
}

interface WiFiConfig {
  networks: WiFiNetwork[]
  mdns: string,
  ap: {
    ssid: string,
    psk: string,
  }
}

const getSettings = (
  setWifiConfig: (value: WiFiConfig | undefined) => void,
  setStatus: (status: string) => void,
): (() => void) => {
  setStatus('loading');

  const controller = new AbortController();
  const signal = controller.signal;

  const wificonfigGet = async () => {
    try {
      const res = await fetch('/wificonfig/get', { signal });
      const wifiConfig = await res.json();

      // eslint-disable-next-line no-param-reassign
      wifiConfig.mdns = wifiConfig.mdns || '';
      // eslint-disable-next-line no-param-reassign
      wifiConfig.ap = wifiConfig.ap || { ssid: '', psk: '' };
      // eslint-disable-next-line no-param-reassign
      wifiConfig.networks = wifiConfig.networks || [];

      setStatus('');
      setWifiConfig(wifiConfig);
    } catch (error) {
      if (!signal.aborted) {
        setStatus('error');
        setWifiConfig(undefined);
      }
    }
  };

  wificonfigGet();

  return () => {
    controller.abort('Navigated while getting wifi settings');
  };
};

const saveSettings = async (
  setWifiConfig: (value: WiFiConfig | undefined) => void,
  setStatus: (status: string) => void,
  wifiConfig: WiFiConfig,
) => {
  const configUpdate = {
    ...wifiConfig,
    networks: wifiConfig.networks
      // send only if needs to be deleted, or psk has changed
      .filter((network) => (network.delete === true || network.psk))
      // dont save unnamed new networks
      .filter((network) => (network.ssid))
      // dont save new+deleted networks
      .filter((network) => !(network.delete && network.isNew))
      // remove "new" property
      .map(({ ssid, psk, delete: del }) => ({
        delete: del,
        ssid,
        psk,
      })),
  };

  setStatus('loading');

  try {
    const res = await fetch('/wificonfig/set', {
      method: 'post',
      body: JSON.stringify(configUpdate),
    });
    const resJson = await res.json();

    if (resJson.error) {
      throw new Error(resJson.error);
    }
  } catch (error) {
    // eslint-disable-next-line no-alert
    alert(error);
    setStatus('error');
    setWifiConfig(undefined);
  }

  getSettings(setWifiConfig, setStatus);
};

function WiFiSettings() {
  const [wifiConfig, setWifiConfig] = useState<WiFiConfig>();
  const [status, setStatus] = useState('loading');
  const { type, button } = useAsPasswordField();

  useEffect(() => (
    getSettings(setWifiConfig, setStatus)
  ), [setWifiConfig, setStatus]);

  if (status === 'loading' || !wifiConfig) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const disabled = (status !== '') && (status !== 'updated');

  return (
    <Stack
      direction="column"
      gap={6}
    >
      <Stack
        direction="column"
        gap={1}
      >
        <Typography component="h3" variant="h3">
          Host Settings
        </Typography>

        <Card raised>
          <CardContent>
            <Stack
              direction="column"
              gap={4}
            >
              <TextField
                id="settings-mdns"
                label="mDNS Name (Bonjour/Avahi)"
                type="text"
                disabled={disabled}
                value={wifiConfig.mdns || ''}
                onChange={(ev) => {
                  const mdns = ev.target.value;
                  setStatus('updated');
                  setWifiConfig({
                    ...wifiConfig,
                    mdns: mdns.trim(),
                  });
                }}
              />

              <TextField
                id="settings-ap-ssid"
                label="Accesspoint SSID"
                type="text"
                disabled={disabled}
                value={wifiConfig.ap.ssid || ''}
                onChange={(ev) => {
                  const ssid = ev.target.value;
                  setStatus('updated');
                  setWifiConfig({
                    ...wifiConfig,
                    ap: {
                      ...wifiConfig.ap,
                      ssid: ssid.trim(),
                    },
                  });
                }}
              />

              <TextField
                id="settings-ap-psk"
                label="Accesspoint Password"
                type={type}
                slotProps={{
                  ...textFieldSlotDefaults,
                  input: {
                    endAdornment: button,
                  },
                }}
                disabled={disabled}
                value={wifiConfig.ap.psk || ''}
                onChange={(ev) => {
                  const psk = ev.target.value;
                  setStatus('updated');
                  setWifiConfig({
                    ...wifiConfig,
                    ap: {
                      ...wifiConfig.ap,
                      psk: psk.trim(),
                    },
                  });
                }}
              />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Stack
        direction="column"
        gap={1}
      >
        <Typography component="h3" variant="h3">
          Networks
        </Typography>

        <Stack
          direction="column"
          gap={2}
          component="ul"
        >
          {
            wifiConfig.networks.map((network, index) => {
              const { ssid, psk = '', delete: del = false, isNew = false } = network;
              return (
                <APConfig
                  key={`apconf-${index}`}
                  id={`apconf-${index}`}
                  ssid={ssid}
                  psk={psk}
                  disabled={disabled}
                  isNew={isNew}
                  delete={del}
                  update={(data) => {
                    const { networks } = wifiConfig;
                    networks[index] = {
                      ...network,
                      ...data,
                    };
                    setStatus('updated');
                    setWifiConfig({
                      ...wifiConfig,
                      networks,
                    });
                  }}
                />
              );
            })
          }

          <Stack
            component="li"
            direction="row"
            justifyContent="flex-end"
          >
            <Button
              disabled={disabled}
              title="Add Network"
              color="primary"
              variant="contained"
              startIcon={<AddBoxIcon />}
              onClick={() => {
                setWifiConfig({
                  ...wifiConfig,
                  networks: [
                    ...(wifiConfig?.networks || []),
                    {
                      ssid: '',
                      psk: '',
                      delete: false,
                      isNew: true,
                    },
                  ],
                });
              }}
            >
              Add Network
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <ButtonGroup
        fullWidth
        variant="contained"
      >
        <Button
          disabled={status !== 'updated'}
          onClick={() => saveSettings(setWifiConfig, setStatus, wifiConfig)}
        >
          Save WiFi-Settings
        </Button>
      </ButtonGroup>
    </Stack>
  );
}

export default WiFiSettings;
