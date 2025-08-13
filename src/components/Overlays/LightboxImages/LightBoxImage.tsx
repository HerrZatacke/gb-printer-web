import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React from 'react';
import ImageLoading from '@/components/ImageLoading';
import ImageRender from '@/components/ImageRender';
import { useImageDimensions } from '@/hooks/useImageDimensions';

export interface LightBoxImageProps {
  hash: string,
  renderContent: boolean,
}

function LightBoxImage({ hash, renderContent }: LightBoxImageProps) {
  const { dimensions } = useImageDimensions(hash);
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
      <Box
        sx={{
          aspectRatio: dimensions.aspectRatioCSS,
          maxHeight: '100%',
        }}
      >
        {renderContent ? (
          <ImageRender hash={hash}/>
        ) : (
          <>
            <ImageLoading dimensions={dimensions} />
          </>
        )}
      </Box>
    </Stack>
  );
}

export default LightBoxImage;
