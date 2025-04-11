import React, { useEffect, useRef } from 'react';
import Alert from '@mui/material/Alert';
import isGoodScaleFactor from '../../../tools/isGoodScaleFactor';
import { applyBitmapFilter } from '../../../tools/applyBitmapFilter';
import SVG from '../SVG';
import './index.scss';

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
    <div
      className="import-preview-image"
      title={`${fileName} - ${scaleFactor}x`}
    >
      <canvas
        className="import-preview-image__canvas"
        width={width}
        height={height}
        ref={originalCanvas}
      />
      <SVG
        className="import-preview-image__arrow"
        name="right"
      />
      <canvas
        className="import-preview-image__canvas"
        width={width}
        height={height}
        ref={canvas}
      />
      {
        isGoodScaleFactor(scaleFactor) ? null : (
          <Alert
            severity="warning"
            variant="filled"
          >
            {`The scale factor of your image is ${scaleFactor.toPrecision(3)}. To get a clean result without artifacts, use images with factors being powers of two. (1, 2, 4, 8 ...)`}
          </Alert>
        )
      }
    </div>
  );
}

export default ImportPreviewImage;
