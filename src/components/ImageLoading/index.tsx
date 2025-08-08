import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import React from 'react';
import { type Dimensions } from '@/hooks/useImageDimensions';

interface Props {
  dimensions: Dimensions,
}

function ImageLoading({ dimensions }: Props) {
  const isLandscape = dimensions.width > dimensions.height;
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'block',
          margin: '0 auto',
          width: isLandscape ? '100%' : `${(1 / dimensions.aspectRatio) * 100}%`,
          aspectRatio: dimensions.aspectRatioCSS,
          maxWidth: '100%', // For Lightbox
          maxHeight: '100%', // For Lightbox
          objectFit: 'contain', // For Lightbox
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
