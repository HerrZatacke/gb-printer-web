import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SocketStateIndicator from '../SocketStateIndicator';
import cleanUrl from '../../../tools/cleanUrl';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sync: true,
      socketUrl: props.socketUrl,
      printerUrl: props.printerUrl,
      pageSize: props.pageSize,
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      printerUrl: state.sync ? cleanUrl(props.printerUrl, 'http') : state.printerUrl,
      socketUrl: state.sync ? cleanUrl(props.socketUrl, 'ws') : state.socketUrl,
      sync: state.sync,
      pageSize: state.sync ? props.pageSize : state.pageSize,
    };
  }

  render() {
    return (
      <div className="settings">
        <div className="settings__inputgroup">
          <label
            htmlFor="settings-pagesize"
            className="settings__label"
          >
            Page size
            <span
              className={
                classnames('settings__note', {
                  'settings__note--warn': !this.props.pageSize,
                })
              }
            >
              (set to 0 to disable pagination - might cause performance issues on large sets of images)
            </span>
          </label>
          <input
            id="settings-pagesize"
            className="settings__input"
            type="number"
            min="0"
            value={this.state.pageSize}
            onChange={({ target }) => {
              this.setState({
                sync: false,
                pageSize: target.value,
              });
            }}
            onBlur={() => {
              this.props.setPageSize(parseInt(this.state.pageSize, 10) || 0);
              this.setState({
                sync: true,
              });
            }}
          />
        </div>
        <div className="settings__inputgroup">
          <div className="settings__label">
            Image export dimensions
          </div>
          {[1, 2, 3, 4, 6, 8, 10].map((factor) => (
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
          <>
            <div className="settings__inputgroup">
              <label htmlFor="settings-socket-url" className="settings__label">
                Remote Socket URL
                <SocketStateIndicator />
              </label>
              <input
                id="settings-socket-url"
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
                      this.setState({
                        sync: true,
                      });
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
                  this.setState({
                    sync: true,
                  });
                }}
              >
                Connect
              </button>
            </div>
            <div className="settings__inputgroup">
              <label htmlFor="settings-printer-url" className="settings__label">
                Printer URL
              </label>
              <input
                id="settings-printer-url"
                className="settings__input"
                value={this.state.printerUrl}
                onChange={({ target }) => {
                  this.setState({
                    sync: false,
                    printerUrl: target.value,
                  });
                }}
                onBlur={() => {
                  this.props.updatePrinterUrl(this.state.printerUrl);
                  this.setState({
                    sync: true,
                  });
                }}
                onKeyUp={(ev) => {
                  switch (ev.key) {
                    case 'Enter':
                      this.props.updatePrinterUrl(this.state.printerUrl);
                      this.setState({
                        sync: true,
                      });
                      break;
                    case 'Escape':
                      this.setState({
                        printerUrl: this.props.printerUrl,
                        sync: true,
                      });
                      break;
                    default:
                  }
                }}
              />
            </div>
          </>
        )}
        <div className="settings__inputgroup settings__buttongroup">
          <button
            type="button"
            className="settings__button"
            onClick={() => this.props.exportSettings('debug')}
          >
            Export debug settings
          </button>
          <button
            type="button"
            className="settings__button"
            onClick={() => this.props.exportSettings('settings')}
          >
            Export settings
          </button>
          <button
            type="button"
            className="settings__button"
            onClick={() => this.props.exportSettings('full')}
          >
            Export everything (including images)
          </button>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  changeExportScaleFactors: PropTypes.func.isRequired,
  exportScaleFactors: PropTypes.array.isRequired,
  printerUrl: PropTypes.string.isRequired,
  socketUrl: PropTypes.string.isRequired,
  updateSocketUrl: PropTypes.func.isRequired,
  updatePrinterUrl: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  setPageSize: PropTypes.func.isRequired,
  exportSettings: PropTypes.func.isRequired,
};

Settings.defaultProps = {};

export default Settings;
