import Stack from '@mui/material/Stack';
import React from 'react';
import { useInteractionsStore } from '@/stores/stores';
import ErrorMessage from './ErrorMessage';

function Error() {

  const { errors, dismissError } = useInteractionsStore();

  return (
    <Stack
      direction="column"
      alignItems="end"
      gap={4}
      sx={{
        position: 'fixed',
        top: 80,
        left: 16,
        right: 16,
        zIndex: 30,
        pointerEvents: 'none',
      }}
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
