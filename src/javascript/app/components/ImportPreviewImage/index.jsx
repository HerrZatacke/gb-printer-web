import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { applyBitmapFilter } from '../../../tools/applyBitmapFilter';
import SVG from '../SVG';
import './index.scss';

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

  // ToDo: messages for Scalefactor
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
