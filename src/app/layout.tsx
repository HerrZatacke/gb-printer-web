import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata, Viewport } from 'next';
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

export const metadata: Metadata = {
  title: 'Game Boy Camera Gallery',
  robots: 'noindex,nofollow',
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body>
        <EnvProvider>
          <GlobalAppInit>
            <Suspense>
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
            </Suspense>
          </GlobalAppInit>
        </EnvProvider>
      </body>
    </html>
  );
};
