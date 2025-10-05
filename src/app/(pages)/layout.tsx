'use client';

import 'reset-css/reset.css';
import '../../scss/generic.scss';
import './globals.scss';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo, type CSSPropertiesVars, Suspense, useEffect, useState } from 'react';
import Errors from '@/components/Errors';
import Navigation from '@/components/Navigation';
import NavigationSkeleton from '@/components/Navigation/Skeleton';
import Overlays from '@/components/Overlays';
import { ThemeName } from '@/consts/theme';
import { useScreenDimensions } from '@/hooks/useScreenDimensions';
import useSettingsStore from '@/stores/settingsStore';
import { darkTheme, lightTheme } from '@/styles/themes';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { themeName } = useSettingsStore();

  const screenDimensions = useScreenDimensions();

  const [ddpx, setDdpx] = useState<CSSPropertiesVars>({});

  useEffect(() => {
    setDdpx({
      '--ddpx': screenDimensions.ddpx,
    });
  }, [screenDimensions]);

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

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Suspense fallback={<NavigationSkeleton />}>
        <Navigation />
      </Suspense>
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
          {children}
        </Stack>
      </Container>
      <Overlays />
      <Errors />
    </ThemeProvider>
  );
}
