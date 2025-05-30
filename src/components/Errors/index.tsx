import Stack from '@mui/material/Stack';
import type { Theme } from '@mui/system';
import React from 'react';
import useInteractionsStore from '@/stores/interactionsStore';
import ErrorMessage from './ErrorMessage';

function Error() {

  const { errors, dismissError } = useInteractionsStore();

  return (
    <Stack
      direction="column"
      gap={4}
      sx={(theme: Theme) => (
        {
          position: 'fixed',
          top: theme.spacing(10),
          right: theme.spacing(2),
          zIndex: 10,
        }
      )}
    >
      { errors.map((errorMessage, index) => (
        <ErrorMessage
          key={errorMessage.id}
          dismiss={() => dismissError(index)}
          errorMessage={errorMessage}
        />
      ))}
    </Stack>
  );
}

export default Error;
