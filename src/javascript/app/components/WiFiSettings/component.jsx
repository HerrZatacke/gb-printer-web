import React from 'react';
import { getEnv } from '../../../tools/getEnv';

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
    fetch('/wificonfig/set', {
      method: 'post',
      body: JSON.stringify(this.state.wifiConfig),
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
    if (!this.state.wifiConfig) {
      return null;
    }

    return (
      <div
        className="wifi-settings"
        ref={this.ref}
      >
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
