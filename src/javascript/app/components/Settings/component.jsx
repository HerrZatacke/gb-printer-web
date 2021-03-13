import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import GitSettings from './pages/GitSettings';
import DropboxSettings from './pages/DropboxSettings';
import GenericSettings from './pages/GenericSettings';
import ExportSettings from './pages/ExportSettings';
import DevURLSettings from './pages/DevURLSettings';
import WiFiSettings from './pages/WiFiSettings';
import { getEnv } from '../../../tools/getEnv';

const tabs = {
  generic: {
    Component: GenericSettings,
    headline: 'Generic Settings',
  },
  git: {
    Component: GitSettings,
    headline: 'Git Settings',
  },
};

if (DROPBOX_APP_KEY) {
  tabs.dropbox = {
    Component: DropboxSettings,
    headline: 'Dropbox Settings',
  };
}

if (
  (getEnv().env === 'esp8266') ||
  (getEnv().env === 'webpack-dev')
) {
  tabs.wifi = {
    Component: WiFiSettings,
    headline: 'WiFi Settings',
  };
}

if (getEnv().env === 'webpack-dev') {
  tabs.devurls = {
    Component: DevURLSettings,
    headline: 'Dev Settings',
  };
}

const Settings = ({ tabName }) => {
  const { Component, headline: currentHeadline } = tabs[tabName];

  return (
    <div className="settings">
      <ul
        className="contenttabs__tabs"
      >
        {
          Object.keys(tabs).map((tabId) => {
            const { headline } = tabs[tabId];
            return (
              <li
                className="contenttabs__tab"
                key={tabId}
              >
                <NavLink
                  to={`/settings/${tabId}`}
                  activeClassName="contenttabs__tabs-button--active"
                  className="button contenttabs__tabs-button"
                  exact
                >
                  {headline}
                </NavLink>
              </li>
            );
          })
        }
      </ul>
      <h2 className="settings__headline">{currentHeadline}</h2>
      <Component />
      <ExportSettings />
    </div>
  );
};

Settings.propTypes = {
  tabName: PropTypes.string,
};

Settings.defaultProps = {
  tabName: Object.keys(tabs)[0],
};

export default Settings;
