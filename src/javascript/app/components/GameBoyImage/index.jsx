import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Decoder from '../../../tools/Decoder';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import './index.scss';

const GameBoyImage = ({
  palette,
  tiles,
  lockFrame,
  invertPalette,
  asThumb,
  rotation,
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
    <div
      className={
        classnames('gameboy-image', {
          'gameboy-image--rot-90': rotation === 1,
          'gameboy-image--rot-180': rotation === 2,
          'gameboy-image--rot-270': rotation === 3,
        })
      }
    >
      <canvas
        className={`gameboy-image__image ${asThumb ? 'gameboy-image__image--as-thumb' : ''}`}
        width={160}
        ref={canvas}
      />
    </div>
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
  rotation: PropTypes.number,
};

GameBoyImage.defaultProps = {
  palette: null,
  asThumb: false,
  rotation: null,
};

export default GameBoyImage;
