import React from 'react';
import { Outlet, NavLink, useMatches, Navigate } from 'react-router-dom';
import ExportSettings from './pages/ExportSettings';
import { getEnv } from '../../../tools/getEnv';

import './index.scss';

const env = getEnv();

const tabs = [
  {
    path: '/settings/generic',
    headline: 'Generic Settings',
  },
  {
    path: '/settings/git',
    headline: 'Git Settings',
  },
  {
    path: '/settings/plugins',
    headline: 'Plugin Settings',
  },
];

if (DROPBOX_APP_KEY) {
  tabs.push({
    path: '/settings/dropbox',
    headline: 'Dropbox Settings',
  });
}

if (
  (getEnv()?.env === 'esp8266') ||
  (getEnv()?.env === 'webpack-dev')
) {
  tabs.push({
    path: '/settings/wifi',
    headline: 'WiFi Settings',
  });
}

function Settings() {
  const matches = useMatches();
  const pathname = matches[2]?.pathname;

  const tab = tabs.find(({ path }) => path === pathname);

  if (!tab) {
    return <Navigate to={tabs[0].path} replace />;
  }

  return (
    <div className="settings">
      <ul
        className="contenttabs__tabs"
      >
        {
          tabs.map(({ headline, path }) => (
            <li
              className="contenttabs__tab"
              key={path}
            >
              <NavLink
                to={path}
                className={({ isActive }) => (`button contenttabs__tabs-button ${isActive ? 'contenttabs__tabs-button--active' : ''}`)}
              >
                {headline}
              </NavLink>
            </li>
          ))
        }
      </ul>
      <h2 className="settings__headline">{tab.headline}</h2>
      <Outlet />
      <ExportSettings />
      <ul className="settings__version">
        <li>{`Web-App version: ${VERSION}`}</li>
        <li>{`Web-App branch: ${BRANCH}`}</li>
        <li>{`Printer version: ${env?.version}`}</li>
        <li>{`Max Images: ${env?.maximages}`}</li>
        <li>{`Localforage driver: ${env?.localforage}`}</li>
        <li>{`Environment type: ${env?.env}`}</li>
        <li>{`Compiled Filesystem: ${env?.fstype}`}</li>
        <li>{`Compiled Bootmode: ${env?.bootmode}`}</li>
        <li>{`Compiled for OLED: ${env?.oled ? 'yes' : 'no'}`}</li>
      </ul>
    </div>
  );
}

export default Settings;
