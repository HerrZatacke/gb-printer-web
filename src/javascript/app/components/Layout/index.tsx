import React from 'react';
import type { CSSPropertiesVars } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Outlet, Navigate, useMatches } from 'react-router';
import Navigation from '../Navigation';
import Overlays from '../Overlays';
import Errors from '../Errors';
import GalleryTreeContextProvider from '../../contexts/galleryTree/GalleryTreeContextProvider';
import PluginsContextProvider from '../../contexts/plugins/PluginsContextProvider';
import RemotePrinterContextProvider from '../../contexts/remotePrinter/RemotePrinterContextProvider';
import { NavigationToolsProvider } from '../../contexts/navigationTools/NavigationToolsProvider';
import { useScreenDimensions } from '../../../hooks/useScreenDimensions';

import './index.scss';
import { useTheme } from '../../../hooks/useTheme';

export interface Handle {
  headline: string,
}

function Layout() {
  const matches = useMatches();
  const screenDimensions = useScreenDimensions();
  const { muiTheme } = useTheme();

  if (!matches[1]) {
    return <Navigate to="/gallery/page/1" replace />;
  }

  const mainHeadline = (matches[1]?.handle as Handle | undefined)?.headline;

  const ddpx: CSSPropertiesVars = {
    '--ddpx': screenDimensions.ddpx,
  };

  console.log(muiTheme);

  return (
    <PluginsContextProvider>
      <GalleryTreeContextProvider>
        <NavigationToolsProvider>
          <RemotePrinterContextProvider>
            <ThemeProvider theme={muiTheme}>
              <CssBaseline />
              <Navigation />
              <div className="layout" style={ddpx}>
                { mainHeadline && <h1 className="layout__main-headline">{ mainHeadline }</h1> }
                <Outlet />
              </div>
              <Overlays />
              <Errors />
            </ThemeProvider>
          </RemotePrinterContextProvider>
        </NavigationToolsProvider>
      </GalleryTreeContextProvider>
    </PluginsContextProvider>
  );
}

export default Layout;
