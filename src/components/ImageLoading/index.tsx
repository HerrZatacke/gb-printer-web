import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import React from 'react';
import { type Dimensions } from '@/hooks/useImageDimensions';

interface Props {
  dimensions: Dimensions,
  asThumb?: boolean,
}

function ImageLoading({ dimensions, asThumb }: Props) {
  return (
    <Box
      sx={{
        display: asThumb ? 'flex' : 'block',
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          margin: '0 auto',
          aspectRatio: dimensions.aspectRatioCSS,
          maxWidth: '100%', // For Lightbox
          maxHeight: '100%', // For Lightbox
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
        />
      </Box>
    </Box>
  );
}

export default ImageLoading;
