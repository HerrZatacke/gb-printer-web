import React, { useEffect, useMemo } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { CSSPropertiesVars } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Outlet, Navigate, useMatches } from 'react-router';
import Navigation from '../Navigation';
import Overlays from '../Overlays';
import Errors from '../Errors';
import GalleryTreeContextProvider from '../../contexts/galleryTree/GalleryTreeContextProvider';
import PluginsContextProvider from '../../contexts/plugins/PluginsContextProvider';
import RemotePrinterContextProvider from '../../contexts/remotePrinter/RemotePrinterContextProvider';
import { NavigationToolsProvider } from '../../contexts/navigationTools/NavigationToolsProvider';
import { useScreenDimensions } from '../../../hooks/useScreenDimensions';
import useSettingsStore from '../../stores/settingsStore';
import { ThemeName } from '../../../consts/theme';
import { darkTheme, lightTheme } from '../../../styles/themes';

export interface Handle {
  headline: string,
}

function Layout() {
  const matches = useMatches();
  const screenDimensions = useScreenDimensions();
  const { themeName } = useSettingsStore();

  useEffect(() => {
    const classList = document.querySelector('html')?.classList;
    if (!classList) {
      return;
    }

    [ThemeName.BRIGHT, ThemeName.DARK].forEach((oldTheme) => {
      if (oldTheme === themeName) {
        classList.add(themeName);
      } else {
        classList.remove(oldTheme);
      }
    });
  }, [themeName]);

  const muiTheme = useMemo(() => {
    if (themeName === ThemeName.DARK) {
      return darkTheme;
    }

    return lightTheme;
  }, [themeName]);

  const belowMd = useMediaQuery(muiTheme.breakpoints.down('md'));

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
        <NavigationToolsProvider>
          <RemotePrinterContextProvider>
            <ThemeProvider theme={muiTheme}>
              <CssBaseline />
              <Navigation />
              <Container
                maxWidth="xl"
                sx={{
                  ...ddpx,
                  p: belowMd ? 2 : 3,
                  minHeight: 'calc(100dvh - var(--navigation-height))',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Stack
                  direction="column"
                  gap={2}
                  sx={{ flexGrow: 1 }}
                >
                  {mainHeadline && (
                    <Typography
                      component="h1"
                      variant="h1"
                    >
                      { mainHeadline }
                    </Typography>
                  )}
                  <Outlet />
                </Stack>
              </Container>
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
