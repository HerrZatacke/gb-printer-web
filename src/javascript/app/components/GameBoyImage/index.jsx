import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Decoder from '../../../tools/Decoder';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import './index.scss';

const GameBoyImage = ({
  palette,
  tiles,
  lockFrame,
  invertPalette,
  asThumb,
}) => {

  const canvas = useRef(null);

  useEffect(() => {
    if (!palette || !tiles) {
      return;
    }

    try {
      if (palette.length) {
        const decoder = new Decoder();
        decoder.update({
          canvas: canvas.current,
          tiles,
          palette,
          lockFrame,
          invertPalette,
        });
      } else {
        const decoder = new RGBNDecoder();
        decoder.update({
          canvas: canvas.current,
          tiles,
          palette,
          lockFrame,
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`error in GameBoyImage: ${error.message}`);
    }
  }, [tiles, palette, lockFrame, invertPalette]);

  return (
    <canvas
      className={`gameboy-image ${asThumb ? 'gameboy-image--as-thumb' : ''}`}
      width={160}
      ref={canvas}
    />
  );
};

GameBoyImage.propTypes = {
  tiles: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.object),
  ]).isRequired,
  palette: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  lockFrame: PropTypes.bool.isRequired,
  invertPalette: PropTypes.bool.isRequired,
  asThumb: PropTypes.bool,
};

GameBoyImage.defaultProps = {
  palette: null,
  asThumb: false,
};

export default GameBoyImage;
