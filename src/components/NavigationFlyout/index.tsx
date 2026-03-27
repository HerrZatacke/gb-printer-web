import {
  Box,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import NavigationFlyoutContent from '@/components/NavigationFlyoutContent';
import { FlyoutContent } from '@/types/Navigation';

interface Props {
  flyoutContents: FlyoutContent[];
  close: () => void;
}

function NavigationFlyout({ flyoutContents, close }: Props) {
  const active = flyoutContents?.length > 0;
  return (
    <Box
      sx={{
        interpolateSize: 'allow-keywords',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: active ? 'auto' : 0,
        transition: 'height 200ms ease-in-out',
        overflow: 'hidden',
        pt: 'calc(var(--navigation-height) + 10px)',
        pb: 2,
        zIndex: 0,
      }}
    >
      <Container maxWidth="xl">
        <Paper elevation={3}>
          <Grid container>
            {flyoutContents.map((flyoutContent, index) => (
              <NavigationFlyoutContent
                key={`${flyoutContent.headline}-${index}`}
                flyoutContent={flyoutContent}
                close={close}
              />
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default NavigationFlyout;
