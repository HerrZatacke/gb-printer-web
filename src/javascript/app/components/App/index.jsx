import React from 'react';
import {
  createHashRouter as createRouter,
  RouterProvider,
} from 'react-router-dom';
import Home from '../Home';
import Gallery from '../Gallery';
import Import from '../Import';
import Palettes from '../Palettes';
import Frames from '../Frames';
import Settings from '../Settings';
import WebUSBGreeting from '../WebUSBGreeting';
import { getEnv } from '../../../tools/getEnv';
import Layout from '../Layout';
import Error from '../Error';
import GenericSettings from '../Settings/pages/GenericSettings';
import GitSettings from '../Settings/pages/GitSettings';
import PluginSettings from '../Settings/pages/PluginSettings';
import DropboxSettings from '../Settings/pages/DropboxSettings';
import WiFiSettings from '../Settings/pages/WiFiSettings';

const App = () => {
  const router = createRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {
          path: '/home',
          element: <Home />,
        },
        {
          path: '/gallery',
          element: <Gallery />,
          handle: {
            headline: 'Gallery',
          },
          children: [
            {
              path: 'page/:page',
              element: <Gallery />,
            },
          ],
        },
        {
          path: '/import',
          element: <Import />,
          handle: {
            headline: 'Import',
          },
        },
        {
          path: '/palettes',
          element: <Palettes />,
          handle: {
            headline: 'Palettes',
          },
        },
        {
          path: '/frames',
          element: <Frames />,
          handle: {
            headline: 'Frames',
          },
        },
        {
          path: '/settings',
          element: <Settings />,
          handle: {
            headline: 'Settings',
          },
          children: [
            {
              path: 'generic',
              element: <GenericSettings />,
              handle: {
                headline: 'Generic Settings',
              },
            },
            {
              path: 'git',
              element: <GitSettings />,
              handle: {
                headline: 'Git Settings',
              },
            },
            {
              path: 'plugins',
              element: <PluginSettings />,
              handle: {
                headline: 'Plugin Settings',
              },
            },
            (DROPBOX_APP_KEY) ? {
              path: 'dropbox',
              element: <DropboxSettings />,
              handle: {
                headline: 'Dropbox Settings',
              },
            } : null,
            (
              (getEnv().env === 'esp8266') ||
              (getEnv().env === 'webpack-dev')
            ) ? {
                path: 'wifi',
                element: <WiFiSettings />,
                handle: {
                  headline: 'WiFi Settings',
                },
              } : null,
          ].filter(Boolean),
        },
        {
          path: '/webusb',
          element: <WebUSBGreeting />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
