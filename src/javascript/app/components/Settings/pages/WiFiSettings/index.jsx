import React, { useRef, useState, useEffect } from 'react';
import APConfig from './APConfig';
import SVG from '../../../SVG';
import Input from '../../../Input';
import './index.scss';

const getSettings = (setWifiConfig, setStatus) => {
  setStatus('loading');

  const controller = new AbortController();
  const signal = controller.signal;

  fetch('/wificonfig/get', { signal })
    .then((res) => res.json())
    .then((wifiConfig) => {

      // eslint-disable-next-line no-param-reassign
      wifiConfig.mdns = wifiConfig.mdns || '';
      // eslint-disable-next-line no-param-reassign
      wifiConfig.ap = wifiConfig.ap || { ssid: '', psk: '' };
      // eslint-disable-next-line no-param-reassign
      wifiConfig.networks = wifiConfig.networks || [];

      setStatus('');
      setWifiConfig(wifiConfig);
    })
    .catch(() => {
      if (signal.aborted) {
        return;
      }

      setStatus('error');
      setWifiConfig(null);
    });

  return () => {
    controller.abort();
  };
};

const saveSettings = (setWifiConfig, setStatus, wifiConfig) => {
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
  fetch('/wificonfig/set', {
    method: 'post',
    body: JSON.stringify(configUpdate),
  })
    .then((res) => res.json())
    .then((resJson) => {
      if (resJson.error) {
        throw new Error(resJson.error);
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-alert
      alert(error);
      setStatus('error');
      setWifiConfig(null);
    })
    .then(() => {
      getSettings(setWifiConfig, setStatus);
    });
};

const WiFiSettings = () => {

  const ref = useRef(null);
  const [wifiConfig, setWifiConfig] = useState(null);
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
        type="text"
        disabled={disabled}
        value={wifiConfig.mdns}
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
        type="text"
        disabled={disabled}
        value={wifiConfig.ap.ssid}
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
        type="password"
        disabled={disabled}
        value={wifiConfig.ap.psk}
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
