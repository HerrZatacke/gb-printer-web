import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React from 'react';
import ImageRender from '@/components/ImageRender';
import usePreviewImages from '@/hooks/usePreviewImages';

interface Props {
  palette: string[],
}

function PalettePreview({ palette }: Props) {
  const { previewImages } = usePreviewImages();

  return (
    <Stack
      direction="row"
      gap={2}
      component="ul"
      justifyContent="space-around"
    >
      {
        previewImages.map((imageHash) => (
          <Box
            key={imageHash}
            component="li"
            sx={{
              flex: '160px 0 0',
            }}
          >
            <ImageRender hash={imageHash} overrides={{ palette , framePalette: palette }} />
          </Box>
        ))
      }
    </Stack>
  );
}

export default PalettePreview;
