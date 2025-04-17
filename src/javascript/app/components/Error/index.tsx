import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouteError } from 'react-router';
import Debug from '../Debug';

function Error() {
  const error = useRouteError();
  console.error(error);

  return (
    <Stack direction="column" gap={4}>
      <Typography
        variant="h4"
        component="h1"
      >
        { (error as { statusText: string})?.statusText || (error as Error).message }
      </Typography>
      <Debug text={(error as Error).stack || ''} />
    </Stack>
  );
}

export default Error;
