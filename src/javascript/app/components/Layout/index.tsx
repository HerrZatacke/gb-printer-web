import React from 'react';
import type { CSSPropertiesVars } from 'react';
import { Outlet, Navigate, useMatches } from 'react-router-dom';
import Navigation from '../Navigation';
import Overlays from '../Overlays';
import Errors from '../Errors';
import GalleryTreeContextProvider from '../../contexts/galleryTree/GalleryTreeContextProvider';
import PluginsContextProvider from '../../contexts/plugins/PluginsContextProvider';
import RemotePrinterContextProvider from '../../contexts/remotePrinter/RemotePrinterContextProvider';
import { useScreenDimensions } from '../../../hooks/useScreenDimensions';

import './index.scss';

export interface Handle {
  headline: string,
}

function Layout() {
  const matches = useMatches();
  const screenDimensions = useScreenDimensions();

  if (!matches[1]) {
    return <Navigate to="/gallery/page/1" replace />;
  }

  const mainHeadline = (matches[1]?.handle as Handle | undefined)?.headline;

  const ddpx: CSSPropertiesVars = {
    '--ddpx': screenDimensions.ddpx,
  };

  return (
    <PluginsContextProvider>
      <GalleryTreeContextProvider>
        <RemotePrinterContextProvider>
          <Navigation />
          <div className="layout" style={ddpx}>
            { mainHeadline && <h1 className="layout__main-headline">{ mainHeadline }</h1> }
            <Outlet />
          </div>
          <Overlays />
          <Errors />
        </RemotePrinterContextProvider>
      </GalleryTreeContextProvider>
    </PluginsContextProvider>
  );
}

export default Layout;
