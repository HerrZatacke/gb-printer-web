import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import isGoodScaleFactor from '../../../tools/isGoodScaleFactor';
import { applyBitmapFilter } from '../../../tools/applyBitmapFilter';
import SVG from '../SVG';
import './index.scss';
import InfoText, { InfoTextTheme } from '../Overlays/Confirm/fields/InfoText';

const ImportPreviewImage = ({
  imageData,
  scaleFactor,
  width,
  height,
  fileName,
  palette,
  dither,
  contrastBaseValues,
}) => {

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
          <InfoText
            label={`The scale factor of your image is ${scaleFactor.toPrecision(3)}. To get a clean result without artifacts, use images with factors being powers of two. (1, 2, 4, 8 ...)`}
            themes={[InfoTextTheme.WARNING]}
          />
        )
      }
    </div>
  );
};

ImportPreviewImage.propTypes = {
  imageData: PropTypes.object.isRequired,
  scaleFactor: PropTypes.number.isRequired,
  fileName: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  palette: PropTypes.array.isRequired,
  dither: PropTypes.bool.isRequired,
  contrastBaseValues: PropTypes.array.isRequired,
};

export default ImportPreviewImage;
