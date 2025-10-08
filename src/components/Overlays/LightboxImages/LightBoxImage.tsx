import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React from 'react';
import ImageRender from '@/components/ImageRender';

export interface LightBoxImageProps {
  hash: string,
}

function LightBoxImage({ hash }: LightBoxImageProps) {
  return (
    <Stack
      direction="column"
      key={hash}
      tabIndex={0}
      sx={{
        flex: '0 0 auto',
        width: '100%',
      }}
      justifyContent="center"
    >
      <Box sx={{ maxHeight: '100%' }}>
        <ImageRender hash={hash}/>
      </Box>
    </Stack>
  );
}

export default LightBoxImage;
