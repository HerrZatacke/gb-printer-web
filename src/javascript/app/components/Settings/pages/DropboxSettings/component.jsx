import React from 'react';
import PropTypes from 'prop-types';

const DropboxSettings = ({ loggedIn, logout, startAuth, startSync }) => (
  <>
    <div>
      <button
        type="button"
        className="button"
        disabled={loggedIn}
        onClick={startAuth}
      >
        Authenticate
      </button>
      <button
        type="button"
        className="button"
        disabled={!loggedIn}
        onClick={logout}
      >
        Logout
      </button>
      <button
        type="button"
        className="button"
        disabled={!loggedIn}
        onClick={() => {
          startSync('up');
        }}
      >
        Sync to Dropbox
      </button>
      <button
        type="button"
        className="button"
        disabled={!loggedIn}
        onClick={() => {
          startSync('down');
        }}
      >
        Sync from Dropbox
      </button>
    </div>
  </>
);

DropboxSettings.propTypes = {
  logout: PropTypes.func.isRequired,
  startSync: PropTypes.func.isRequired,
  startAuth: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
};

export default DropboxSettings;
