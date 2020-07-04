import React from 'react';
import { getEnv } from '../../../tools/getEnv';
import APConfig from './APConfig';
import SVG from '../SVG';

class WiFiSettings extends React.Component {
  constructor(props) {
    super(props);
    this.env = getEnv();

    this.ref = React.createRef();
    this.saveSettings = this.saveSettings.bind(this);
    this.getSettings = this.getSettings.bind(this);

    this.state = {
      sync: false,
      wifiConfig: null,
    };
  }

  componentDidMount() {
    this.getSettings();
  }

  componentWillUnmount() {
    this.emptyPassWordFields();
  }

  getSettings() {
    fetch('/wificonfig/get')
      .then((res) => res.json())
      .then((wifiConfig) => {

        // eslint-disable-next-line no-param-reassign
        wifiConfig.mdns = wifiConfig.mdns || '';
        // eslint-disable-next-line no-param-reassign
        wifiConfig.ap = wifiConfig.ap || { ssid: '', psk: '' };
        // eslint-disable-next-line no-param-reassign
        wifiConfig.networks = wifiConfig.networks || [];

        this.setState({
          sync: true,
          wifiConfig,
        });
      })
      .catch(() => {
        this.setState({
          sync: false,
          wifiConfig: null,
        });
      });
  }

  saveSettings() {
    const configUpdate = {
      ...this.state.wifiConfig,
      networks: this.state.wifiConfig.networks
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
        this.setState({
          sync: false,
          wifiConfig: null,
        });
      })
      .then(() => {
        this.getSettings();
      });
  }

  emptyPassWordFields() {
    // this workaround should prevent all browsers form asking to "save password"
    const pwFields = this.ref.current.querySelectorAll('[type=password');
    [...pwFields].forEach((field) => {
      // eslint-disable-next-line no-param-reassign
      field.value = '';
    });
  }

  render() {
    const { wifiConfig, sync } = this.state;
    if (!wifiConfig) {
      return null;
    }

    return (
      <div
        className="wifi-settings"
        ref={this.ref}
      >
        <h3 className="wifi-settings__subheadline">
          Host Settings
        </h3>
        <div className="settings__inputgroup">
          <label
            htmlFor="settings-mdns"
            className="settings__label"
          >
            mDNS Name (Bonjour/Avahi)
          </label>
          <input
            id="settings-mdns"
            className="settings__input"
            type="text"
            value={wifiConfig.mdns}
            onChange={({ target }) => {
              this.setState({
                sync: false,
                wifiConfig: {
                  ...wifiConfig,
                  mdns: target.value.trim(),
                },
              });
            }}
          />
        </div>
        <div className="settings__inputgroup">
          <label
            htmlFor="settings-ap-ssid"
            className="settings__label"
          >
            Accesspoint SSID
          </label>
          <input
            id="settings-ap-ssid"
            className="settings__input"
            type="text"
            value={wifiConfig.ap.ssid}
            onChange={({ target }) => {
              this.setState({
                sync: false,
                wifiConfig: {
                  ...wifiConfig,
                  ap: {
                    ...wifiConfig.ap,
                    ssid: target.value.trim(),
                  },
                },
              });
            }}
          />
        </div>
        <div className="settings__inputgroup">
          <label
            htmlFor="settings-ap-psk"
            className="settings__label"
          >
            Accesspoint Password
          </label>
          <input
            id="settings-ap-psk"
            className="settings__input"
            type="password"
            placeholder="••••••••"
            value={wifiConfig.ap.psk || ''}
            onChange={({ target }) => {
              this.setState({
                sync: false,
                wifiConfig: {
                  ...wifiConfig,
                  ap: {
                    ...wifiConfig.ap,
                    psk: target.value.trim(),
                  },
                },
              });
            }}
          />
        </div>
        <h3 className="wifi-settings__subheadline">
          Networks
          <button
            type="button"
            className="settings__button wifi-settings__button wifi-settings__button--add"
            onClick={() => {
              const { networks } = wifiConfig;
              networks.push({
                ssid: '',
                psk: '',
                delete: false,
                isNew: true,
              });
              this.setState({
                sync: false,
                wifiConfig: {
                  ...wifiConfig,
                  networks,
                },
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
                  isNew={isNew}
                  delete={del}
                  update={(data) => {
                    const { networks } = wifiConfig;
                    networks[index] = {
                      ...network,
                      ...data,
                    };
                    this.setState({
                      sync: false,
                      wifiConfig: {
                        ...wifiConfig,
                        networks,
                      },
                    });
                  }}
                />
              );
            })
          }
        </ul>
        <div className="settings__inputgroup wifi-settings__buttongroup">
          <button
            type="button"
            disabled={sync}
            className="settings__button wifi-settings__button"
            onClick={this.saveSettings}
          >
            Save WiFi-Settings
          </button>
        </div>
      </div>
    );
  }
}

export default WiFiSettings;
