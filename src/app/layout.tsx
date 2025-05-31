import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Viewport } from 'next';
import { PropsWithChildren, Suspense } from 'react';
import GlobalAppInit from '@/components/GlobalAppInit';
import { EnvProvider } from '@/contexts/envContext';
import { GalleryTreeContext } from '@/contexts/galleryTree/Provider';
import { NavigationToolsProvider } from '@/contexts/navigationTools/NavigationToolsProvider';
import { PluginsContext } from '@/contexts/plugins/Provider';
import RemotePrinterContextProvider from '@/contexts/remotePrinter/RemotePrinterContextProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <head>
        <title>Game Boy Camera Gallery</title>
        <meta name="robots" content="noindex,nofollow"/>
        <meta name="replacewith" content={process.env.NEXT_PUBLIC_MANIFEST_TAGS} />
      </head>
      <body>
        <EnvProvider>
          <Suspense>
            <GlobalAppInit>
              <PluginsContext>
                <GalleryTreeContext>
                  <NavigationToolsProvider>
                    <RemotePrinterContextProvider>
                      <AppRouterCacheProvider>
                        {children}
                      </AppRouterCacheProvider>
                    </RemotePrinterContextProvider>
                  </NavigationToolsProvider>
                </GalleryTreeContext>
              </PluginsContext>
            </GlobalAppInit>
          </Suspense>
        </EnvProvider>
      </body>
    </html>
  );
};
