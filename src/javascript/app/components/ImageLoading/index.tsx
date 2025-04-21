import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

function ImageLoading() {
  return (
    <Box
      sx={{
        width: '100%',
        paddingTop: '90%',
        height: 0,
        display: 'block',
        background: 'transparent',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress color="primary" size={40} />
      </Box>
    </Box>
  );
}

export default ImageLoading;
