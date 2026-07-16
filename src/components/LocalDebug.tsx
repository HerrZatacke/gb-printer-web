import { Alert, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { delay } from '@/tools/delay';

function LocalDebug() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      delay(1).then(() => {
        setShouldRender(true);
      });
    }
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <Paper>
      <Stack
        direction="column"
      >
        <Alert severity="warning" variant="filled">
          Debug Stuff
        </Alert>
      </Stack>
    </Paper>
  );
}

export default LocalDebug;
