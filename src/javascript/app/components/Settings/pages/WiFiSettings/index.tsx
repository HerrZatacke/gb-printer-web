import React, { useEffect, useRef, useState } from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import APConfig from './APConfig';
import SVG from '../../../SVG';
import Input, { InputType } from '../../../Input';
import './index.scss';

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

  const ref = useRef(null);
  const [wifiConfig, setWifiConfig] = useState<WiFiConfig>();
  const [status, setStatus] = useState('loading');

  useEffect(() => (
    getSettings(setWifiConfig, setStatus)
  ), [setWifiConfig, setStatus]);

  if (status === 'loading' || !wifiConfig) {
    return <div className="wifi-settings--loading" />;
  }

  const disabled = (status !== '') && (status !== 'updated');

  return (
    <div
      className="wifi-settings"
      ref={ref}
    >
      <h3 className="wifi-settings__subheadline">
        Host Settings
      </h3>

      <Input
        id="settings-mdns"
        labelText="mDNS Name (Bonjour/Avahi)"
        type={InputType.TEXT}
        disabled={disabled}
        value={wifiConfig.mdns}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={(mdns) => {
          setStatus('updated');
          setWifiConfig({
            ...wifiConfig,
            mdns: mdns.trim(),
          });
        }}
      />

      <Input
        id="settings-ap-ssid"
        labelText="Accesspoint SSID"
        type={InputType.TEXT}
        disabled={disabled}
        value={wifiConfig.ap.ssid}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={(ssid) => {
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

      <Input
        id="settings-ap-psk"
        labelText="Accesspoint Password"
        type={InputType.PASSWORD}
        disabled={disabled}
        value={wifiConfig.ap.psk}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={(psk) => {
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

      <h3 className="wifi-settings__subheadline">
        Networks
        <button
          type="button"
          disabled={disabled}
          className="button wifi-settings__button wifi-settings__button--add"
          onClick={() => {
            const { networks } = wifiConfig;
            networks.push({
              ssid: '',
              psk: '',
              delete: false,
              isNew: true,
            });

            setWifiConfig({
              ...wifiConfig,
              networks,
            });
          }}
        >
          <SVG name="add" />
        </button>
      </h3>
      <ul
        className="wifi-settings__ap-groups"
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
      </ul>
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
    </div>
  );
}

export default WiFiSettings;
