import React, { useState } from 'react';
import type { Theme } from '@mui/system';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import type { ErrorMessage } from '../../stores/interactionsStore';
import { getPreStyles } from '../../../styles/tools/getPreStyles';

interface Props {
  dismiss: () => void,
  errorMessage: ErrorMessage,
}

function Error({ dismiss, errorMessage }: Props) {
  const [showStack, setShowStack] = useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    dismiss();
  };

  return (
    <Alert
      severity="error"
      variant="filled"
      sx={{ minWidth: 300 }}
      action={(
        <>
          {errorMessage.error.stack && !showStack && (
            <IconButton
              size="small"
              title="Show error stack"
              aria-label="close"
              color="inherit"
              onClick={() => setShowStack(true)}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      )}
    >
      <AlertTitle
        sx={{ color: 'inherit' }}
      >
        {errorMessage.error.message}
      </AlertTitle>
      { showStack && (
        <Typography
          variant="caption"
          fontFamily="monospace"
          component="pre"
          sx={(theme: Theme) => getPreStyles(theme, {
            backgroundColor: '#FFFFFF22',
            maxHeight: '200px',
            overflow: 'auto',
            p: 1,
          })}
        >
          {errorMessage.error.stack}
        </Typography>
      )}
    </Alert>
  );
}

export default Error;
