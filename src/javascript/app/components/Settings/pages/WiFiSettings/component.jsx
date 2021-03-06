import React from 'react';
import APConfig from './APConfig';
import SVG from '../../../SVG';
import Input from '../../../Input';

class WiFiSettings extends React.Component {
  constructor(props) {
    super(props);

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
    if (!this.ref.current) {
      return;
    }

    // this workaround should prevent all browsers form asking to "save password"
    const pwFields = this.ref.current.querySelectorAll('[type=password]');
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

        <Input
          id="settings-mdns"
          labelText="mDNS Name (Bonjour/Avahi)"
          type="text"
          value={wifiConfig.mdns}
          onChange={(mdns) => {
            this.setState({
              sync: false,
              wifiConfig: {
                ...wifiConfig,
                mdns: mdns.trim(),
              },
            });
          }}
        />

        <Input
          id="settings-ap-ssid"
          labelText="Accesspoint SSID"
          type="text"
          value={wifiConfig.ap.ssid}
          onChange={(ssid) => {
            this.setState({
              sync: false,
              wifiConfig: {
                ...wifiConfig,
                ap: {
                  ...wifiConfig.ap,
                  ssid: ssid.trim(),
                },
              },
            });
          }}
        />

        <Input
          id="settings-ap-psk"
          labelText="Accesspoint Password"
          type="password"
          value={wifiConfig.ap.psk}
          onChange={(psk) => {
            this.setState({
              sync: false,
              wifiConfig: {
                ...wifiConfig,
                ap: {
                  ...wifiConfig.ap,
                  psk: psk.trim(),
                },
              },
            });
          }}
        />

        <h3 className="wifi-settings__subheadline">
          Networks
          <button
            type="button"
            className="button wifi-settings__button wifi-settings__button--add"
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
        <div className="inputgroup buttongroup">
          <button
            type="button"
            disabled={sync}
            className="button"
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
