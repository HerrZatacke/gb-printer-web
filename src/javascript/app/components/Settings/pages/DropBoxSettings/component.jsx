import React from 'react';
import PropTypes from 'prop-types';

const DropBoxSettings = ({ dropboxToken, logout, startAuth, startSync }) => (
  <>
    <div>
      <button
        type="button"
        className="button"
        disabled={!!dropboxToken}
        onClick={startAuth}
      >
        Authenticate
      </button>
      <button
        type="button"
        className="button"
        disabled={!dropboxToken}
        onClick={logout}
      >
        Logout
      </button>
      <button
        type="button"
        className="button"
        disabled={!dropboxToken}
        onClick={() => {
          startSync('up');
        }}
      >
        Sync to Dropbox
      </button>
      <button
        type="button"
        className="button"
        disabled={!dropboxToken}
        onClick={() => {
          startSync('down');
        }}
      >
        Sync from Dropbox
      </button>
    </div>
  </>
);

DropBoxSettings.propTypes = {
  logout: PropTypes.func.isRequired,
  startSync: PropTypes.func.isRequired,
  startAuth: PropTypes.func.isRequired,
  dropboxToken: PropTypes.string,
};

DropBoxSettings.defaultProps = {
  dropboxToken: null,
};

export default DropBoxSettings;
