import React, { useState } from 'react';
import classnames from 'classnames';
import GitSettings from './pages/GitSettings';
import GenericSettings from './pages/GenericSettings';
import ExportSettings from './pages/ExportSettings';
import DevURLSettings from './pages/DevURLSettings';
import WiFiSettings from './pages/WiFiSettings';
import PluginSettings from './pages/PluginSettings';
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
  plugins: {
    Component: PluginSettings,
    headline: 'Plugin Settings',
  },
};

if (getEnv().env === 'esp8266') {
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

const Settings = () => {

  const [selectedTab, setSelectedTab] = useState(Object.keys(tabs)[0]);

  const { Component, headline: currentHeadline } = tabs[selectedTab];

  return (
    <div className="settings">
      <ul
        className="settings__tabs"
      >
        {
          Object.keys(tabs).map((tabId) => {
            const { headline } = tabs[tabId];
            return (
              <li
                className="settings__tab"
                key={tabId}
              >
                <button
                  type="button"
                  className={
                    classnames('button settings__tabs-button', {
                      'button settings__tabs-button--active': tabId === selectedTab,
                    })
                  }
                  onClick={() => setSelectedTab(tabId)}
                >
                  {headline}
                </button>
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

Settings.propTypes = {};

Settings.defaultProps = {};

export default Settings;
