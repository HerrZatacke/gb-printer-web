import React, { useEffect } from 'react';
import type { RouteObject } from 'react-router';
import { createHashRouter as createRouter, RouterProvider } from 'react-router';
import Home from '../Home';
import Gallery from '../Gallery';
import Import from '../Import';
import Palettes from '../Palettes';
import Frames from '../Frames';
import Settings from '../Settings';
import WebUSBGreeting from '../WebUSBGreeting';
import AddPlugin from '../AddPlugin';
import { getEnv } from '../../../tools/getEnv';
import type { Handle } from '../Layout';
import Layout from '../Layout';
import Error from '../Error';
import GenericSettings from '../Settings/pages/GenericSettings';
import GitSettings from '../Settings/pages/GitSettings';
import PluginSettings from '../Settings/pages/PluginSettings';
import DropboxSettings from '../Settings/pages/DropboxSettings';
import WiFiSettings from '../Settings/pages/WiFiSettings';
import { reduceItems } from '../../../tools/reduceArray';
import useFileDrop from '../../../hooks/useFileDrop';
import useTrashbin from '../../../hooks/useTrashbin';
import { dropboxStorageTool } from '../../../tools/dropboxStorage';
import { gitStorageTool } from '../../../tools/gitStorage';
import { useStores } from '../../../hooks/useStores';
import { useImportExportSettings } from '../../../hooks/useImportExportSettings';

function App() {
  useFileDrop();

  const stores = useStores();
  const { remoteImport } = useImportExportSettings();

  useEffect(() => {
    const { subscribe } = dropboxStorageTool(stores, remoteImport);
    gitStorageTool(remoteImport);

    return subscribe();
  }, [remoteImport, stores]);

  const { checkUpdateTrashCount } = useTrashbin();
  useEffect(() => {
    checkUpdateTrashCount();
  }, [checkUpdateTrashCount]);

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
          path: '/gallery/*',
          element: <Gallery />,
          handle: {
            headline: 'Gallery',
          } as Handle,
        },
        {
          path: '/import',
          element: <Import />,
          handle: {
            headline: 'Import',
          } as Handle,
        },
        {
          path: '/palettes',
          element: <Palettes />,
          handle: {
            headline: 'Palettes',
          } as Handle,
        },
        {
          path: '/frames',
          element: <Frames />,
          handle: {
            headline: 'Frames',
          } as Handle,
        },
        {
          path: '/settings',
          element: <Settings />,
          handle: {
            headline: 'Settings',
          } as Handle,
          children: [
            {
              path: 'generic',
              element: <GenericSettings />,
              handle: {
                headline: 'Generic Settings',
              } as Handle,
            },
            {
              path: 'git',
              element: <GitSettings />,
              handle: {
                headline: 'Git Settings',
              } as Handle,
            },
            {
              path: 'plugins',
              element: <PluginSettings />,
              handle: {
                headline: 'Plugin Settings',
              } as Handle,
            },
            (DROPBOX_APP_KEY) ? {
              path: 'dropbox',
              element: <DropboxSettings />,
              handle: {
                headline: 'Dropbox Settings',
              } as Handle,
            } : null,
            (
              (getEnv()?.env === 'esp8266') ||
              (getEnv()?.env === 'webpack-dev')
            ) ? {
                path: 'wifi',
                element: <WiFiSettings />,
                handle: {
                  headline: 'WiFi Settings',
                } as Handle,
              } : null,
          ].reduce(reduceItems<RouteObject>, []),
        },
        {
          path: '/webusb',
          element: <WebUSBGreeting />,
        },
        {
          path: '/add-plugin/:pluginUrl?',
          element: <AddPlugin />,
          handle: {
            headline: 'Add Plugin',
          } as Handle,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
