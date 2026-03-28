import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { type Viewport } from 'next';
import { ComponentType, PropsWithChildren, ReactNode } from 'react';
import GlobalAppInit from '@/components/GlobalAppInit';
import { EnvProvider } from '@/contexts/EnvContext';
import { GalleryTreeProvider } from '@/contexts/GalleryTreeContext';
import { GapiSheetStateProvider } from '@/contexts/GapiSheetStateContext';
import { GapiSyncProvider  } from '@/contexts/GapiSyncContext';
import { GISProvider } from '@/contexts/GisContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { NavigationItemsProvider } from '@/contexts/NavigationItemsContext';
import { NavigationToolsProvider } from '@/contexts/NavigationToolsContext';
import { PluginsProvider } from '@/contexts/PluginsContext';
import { PortsProvider } from '@/contexts/PortsContext';
import { RemotePrinterProvider } from '@/contexts/RemotePrinterContext';
import { SearchParamsProvider } from '@/contexts/SearchParamsContext';
import { TrackingProvider } from '@/contexts/TrackingContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  const providers: ComponentType<{ children: ReactNode }>[] = [
    SearchParamsProvider,
    I18nProvider,
    TrackingProvider,
    GISProvider,
    GapiSheetStateProvider,
    GapiSyncProvider,
    EnvProvider,
    PortsProvider,
    GalleryTreeProvider,
    GlobalAppInit, // needs <GalleryTreeProvider>
    PluginsProvider,
    NavigationToolsProvider, // needs <GalleryTreeProvider>
    NavigationItemsProvider,
    RemotePrinterProvider,
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
        { providers.reduceRight((acc: ReactNode, Provider) => {
          return <Provider>{acc}</Provider>;
        }, children) }
      </body>
    </html>
  );
};
