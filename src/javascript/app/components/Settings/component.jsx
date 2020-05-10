import React from 'react';
import PropTypes from 'prop-types';

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
        <input
          className="url"
          value={this.state.socketUrl}
          onChange={({ target }) => {
            this.setState({
              sync: false,
              socketUrl: target.value,
            });
          }}
        />
        <button
          type="button"
          onClick={() => {
            this.setState({
              sync: true,
            });
            this.props.updateSocketUrl(this.state.socketUrl);
          }}
        >
          Connect
        </button>
        <button
          type="button"
          onClick={this.props.startMock}
        >
          Mock
        </button>
      </div>
    );
  }
}

Settings.propTypes = {
  socketUrl: PropTypes.string.isRequired,
  updateSocketUrl: PropTypes.func.isRequired,
  startMock: PropTypes.func.isRequired,
};

Settings.defaultProps = {
};

export default Settings;
