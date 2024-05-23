import React, { useEffect, useRef, useState } from 'react';
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
  };

  try {
    wificonfigGet();
  } catch (error) {
    if (!signal.aborted) {
      setStatus('error');
      setWifiConfig(undefined);
    }
  }

  return () => {
    controller.abort();
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

const WiFiSettings = () => {

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
        onChange={(mdns) => {
          setStatus('updated');
          setWifiConfig({
            ...wifiConfig,
            mdns: (mdns as string).trim(),
          });
        }}
      />

      <Input
        id="settings-ap-ssid"
        labelText="Accesspoint SSID"
        type={InputType.TEXT}
        disabled={disabled}
        value={wifiConfig.ap.ssid}
        onChange={(ssid) => {
          setStatus('updated');
          setWifiConfig({
            ...wifiConfig,
            ap: {
              ...wifiConfig.ap,
              ssid: (ssid as string).trim(),
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
        onChange={(psk) => {
          setStatus('updated');
          setWifiConfig({
            ...wifiConfig,
            ap: {
              ...wifiConfig.ap,
              psk: (psk as string).trim(),
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
      <div className="inputgroup buttongroup">
        <button
          type="button"
          disabled={status !== 'updated'}
          className="button"
          onClick={() => saveSettings(setWifiConfig, setStatus, wifiConfig)}
        >
          Save WiFi-Settings
        </button>
      </div>
    </div>
  );
};

export default WiFiSettings;
