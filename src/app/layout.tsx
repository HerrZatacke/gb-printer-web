import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Viewport } from 'next';
import { ComponentType, PropsWithChildren, ReactNode } from 'react';
import GlobalAppInit from '@/components/GlobalAppInit';
import { EnvProvider } from '@/contexts/envContext';
import { GalleryTreeContext } from '@/contexts/galleryTree/Provider';
import I18nContext from '@/contexts/i18nContext';
import { NavigationToolsProvider } from '@/contexts/navigationTools/NavigationToolsProvider';
import { PluginsContext } from '@/contexts/plugins/Provider';
import { PortsContext } from '@/contexts/ports/Provider';
import RemotePrinterContextProvider from '@/contexts/remotePrinter/RemotePrinterContextProvider';
import { TrackingProvider } from '@/contexts/TrackingContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  const providers = [
    I18nContext,
    TrackingProvider,
    EnvProvider,
    PortsContext,
    GlobalAppInit,
    PluginsContext,
    GalleryTreeContext,
    NavigationToolsProvider, // needs <GalleryTreeContext>
    RemotePrinterContextProvider,
    AppRouterCacheProvider,
  ];

  return (
    <html lang="en">
      <head>
        <title>Game Boy Camera Gallery</title>
        <meta name="robots" content="noindex,nofollow"/>
        <meta name="replacewith" content={process.env.NEXT_PUBLIC_MANIFEST_TAGS} />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_HOMEPAGE} />
      </head>
      <body>
        { providers.reduceRight((acc: ReactNode, Provider: ComponentType<{ children: ReactNode }>) => {
          return <Provider>{acc}</Provider>;
        }, children) }
      </body>
    </html>
  );
};
