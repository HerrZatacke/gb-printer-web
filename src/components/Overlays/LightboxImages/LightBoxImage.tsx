import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React from 'react';
import ImageRender from '@/components/ImageRender';

export interface LightBoxImageProps {
  hash: string,
  visible: boolean,
}

function LightBoxImage({ hash, visible }: LightBoxImageProps) {
  return (
    <Stack
      direction="column"
      key={hash}
      tabIndex={0}
      sx={{
        flex: '0 0 auto',
        width: visible ? '100%' : '0',
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
