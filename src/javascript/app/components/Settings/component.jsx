import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SocketStateIndicator from '../SocketStateIndicator';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sync: true,
      socketUrl: props.socketUrl,
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      url: state.sync ? props.socketUrl : state.socketUrl,
      sync: state.sync,
    };
  }

  render() {
    return (
      <div className="settings">
        <div className="settings__inputgroup">
          <div className="settings__label">
            Image export dimensions
          </div>
          {[1, 2, 3, 4, 5, 6].map((factor) => (
            <label
              key={factor}
              className={
                classnames('settings__label-check', {
                  'settings__label-check--selected': this.props.exportScaleFactors.includes(factor),
                })
              }
              title={`${factor * 160}×${factor * 144}`}
            >
              {`${factor}×`}
              <input
                type="checkbox"
                checked={this.props.exportScaleFactors.includes(factor)}
                onChange={({ target }) => {
                  this.props.changeExportScaleFactors(factor, target.checked);
                }}
              />
            </label>
          ))}
        </div>
        {(window.location.protocol === 'https:') ? (
          <div className="settings__inputgroup">
            <div className="settings__label">
              SSL WebSockets are currently not supported by the
              {' '}
              <a href="https://github.com/gilmaimon/ArduinoWebsockets/issues/59">
                ArduinoWebsockets library
              </a>
            </div>
          </div>
        ) : (
          <div className="settings__inputgroup">
            <label htmlFor="settings-url" className="settings__label">
              Remote Socket URL
              <SocketStateIndicator />
            </label>
            <input
              id="settings-url"
              className="settings__input"
              value={this.state.socketUrl}
              onChange={({ target }) => {
                this.setState({
                  sync: false,
                  socketUrl: target.value,
                });
              }}
              onKeyUp={(ev) => {
                switch (ev.key) {
                  case 'Enter':
                    this.props.updateSocketUrl(this.state.socketUrl);
                    break;
                  case 'Escape':
                    this.setState({
                      socketUrl: this.props.socketUrl,
                      sync: true,
                    });
                    break;
                  default:
                }
              }}
            />
            <button
              type="button"
              className="settings__button"
              onClick={() => {
                this.setState({
                  sync: true,
                });
                this.props.updateSocketUrl(this.state.socketUrl);
              }}
            >
              Connect
            </button>
          </div>
        )}
        {(ENV === 'production') ? null : (
          <div className="settings__inputgroup">
            <button
              type="button"
              className="settings__button"
              onClick={this.props.startMock}
            >
              Mock
            </button>
          </div>
        )}
      </div>
    );
  }
}

Settings.propTypes = {
  changeExportScaleFactors: PropTypes.func.isRequired,
  exportScaleFactors: PropTypes.array.isRequired,
  socketUrl: PropTypes.string.isRequired,
  startMock: PropTypes.func.isRequired,
  updateSocketUrl: PropTypes.func.isRequired,
};

Settings.defaultProps = {};

export default Settings;
