'use client';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { alpha } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { type Theme } from '@mui/system';
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import useNavigationItems from '@/contexts/NavigationItemsContext';
import { lightTheme } from '@/styles/themes';

function Navigation() {
  const t = useTranslations('Navigation');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [drawerContainer, setDrawerContainer] = useState<HTMLElement | undefined>(undefined);

  const {
    mainNavigationItems,
    mainNavigationActionItems,
  } = useNavigationItems();

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDrawerContainer(document.body);
    }, 1);

    return () => window.clearTimeout(handle);
  }, []);

  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <AppBar color="primary" enableColorOnDark position="sticky">
          <Container maxWidth="xl" disableGutters>
            <Toolbar disableGutters>
              <ButtonGroup
                variant="text"
                component="nav"
                role="navigation"
                aria-label={t('mainNavAriaLabel')}
                sx={{ display: { xs: 'none', md: 'inline-flex' }, width: '100%' }}
              >
                {mainNavigationItems.map(({ route, label }) => (
                  <Button
                    key={route}
                    href={route}
                    prefetch={false}
                    component={NextLink}
                    color="inherit"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {label}
                  </Button>
                ))}
              </ButtonGroup>

              <ButtonGroup
                variant="text"
                role="navigation"
                aria-label={t('utilityNavAriaLabel')}
              >
                {mainNavigationActionItems.map(({ title, Icon, onClick, badgeContent, badgeColor, isBusy, disabled }) => (
                  <IconButton
                    key={title}
                    color="inherit"
                    disabled={disabled}
                    title={title}
                    onClick={onClick}
                    sx={isBusy ? { animation: 'pulse-bg 600ms infinite' } : undefined}
                  >
                    <Badge
                      badgeContent={badgeContent}
                      color={badgeColor}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                    >
                      <Icon />
                    </Badge>
                  </IconButton>
                ))}
                <IconButton
                  color="inherit"
                  title={t('openMainNav')}
                  onClick={() => setMobileNavOpen(true)}
                  sx={{ display: { md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
              </ButtonGroup>
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
      <Drawer
        container={drawerContainer}
        variant="temporary"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={(theme) => ({
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: { xs: '100%', sm: theme.breakpoints.values.sm } },
        })}
      >
        <Toolbar disableGutters>
          <ButtonGroup
            variant="text"
            sx={{ display: { md: 'none' } }}
          >
            <IconButton
              color="inherit"
              title={t('closeMainNav')}
              onClick={() => setMobileNavOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </ButtonGroup>
        </Toolbar>
        <Divider />
        <List>
          {mainNavigationItems.map(({ route, label }) => (
            <ListItem key={route} disablePadding>
              <ListItemButton
                href={route}
                component={NextLink}
                prefetch={false}
                onClick={() => setMobileNavOpen(false)}
                sx={(theme: Theme) => ({
                  '&.active': {
                    background: theme.palette.secondary.light,
                    color: theme.palette.secondary.contrastText,
                  },
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.3),
                  },
                })}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Navigation;
