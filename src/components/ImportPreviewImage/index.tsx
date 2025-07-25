import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef } from 'react';
import { applyBitmapFilter } from '@/tools/applyBitmapFilter';
import isGoodScaleFactor from '@/tools/isGoodScaleFactor';

interface Props {
  imageData: ImageData, // From QueueImage
  scaleFactor: number, // From QueueImage
  width: number, // From QueueImage
  height: number, // From QueueImage
  fileName: string, // From QueueImage
  dither: boolean,
  contrastBaseValues: number[],
  palette: string[],
}

function ImportPreviewImage({
  imageData,
  scaleFactor,
  width,
  height,
  fileName,
  palette,
  dither,
  contrastBaseValues,
}: Props) {
  const canvas = useRef(null);
  const originalCanvas = useRef(null);
  const t = useTranslations('ImportPreviewImage');

  useEffect(() => {
    if (canvas.current && originalCanvas.current && contrastBaseValues?.length) {
      applyBitmapFilter({
        targetCanvas: canvas.current,
        originalCanvas: originalCanvas.current,
        imageData,
        palette,
        dither,
        contrastBaseValues,
      });
    }
  });

  return (
    <Stack
      direction="column"
      gap={1}
    >
      <Stack
        title={`${fileName} - ${scaleFactor}x`}
        direction="row"
        gap={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <canvas
          width={width}
          height={height}
          ref={originalCanvas}
        />
        <DoubleArrowIcon fontSize="large" />
        <canvas
          width={width}
          height={height}
          ref={canvas}
        />
      </Stack>
      {
        isGoodScaleFactor(scaleFactor) ? null : (
          <Alert
            severity="warning"
            variant="filled"
          >
            {t('scaleFactorWarning', { scaleFactor: scaleFactor.toPrecision(3) })}
          </Alert>
        )
      }
    </Stack>
  );
}

export default ImportPreviewImage;
