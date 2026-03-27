import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import WrappedNextLink, { ExactMatchMode } from '@/components/WrappedNextLink';
import { FlyoutContent } from '@/types/Navigation';

interface Props {
  flyoutContent: FlyoutContent;
  close: () => void;
}

function NavigationFlyoutContent({ flyoutContent: { headline, navItems, sizeFlyout }, close }: Props) {
  return (
    <Grid size={sizeFlyout}>
      <Stack
        direction="column"
        gap={2}
      >
        <Typography
          variant="h2"
        >
          {headline}
        </Typography>
        <List>
          {navItems.map(({ route, label }) => (
            <ListItem key={route} disablePadding>
              <ListItemButton
                href={route}
                component={WrappedNextLink}
                exact={ExactMatchMode.EXACT_PATH_AND_SEARCH}
                prefetch={false}
                onClick={close}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Grid>
  );
}

export default NavigationFlyoutContent;
