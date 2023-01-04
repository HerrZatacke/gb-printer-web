import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Decoder from '../../../tools/Decoder';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import './index.scss';
import applyRotation from '../../../tools/applyRotation';

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

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 160;
    tempCanvas.height = 144;

    try {

      if (palette.length) {
        const decoder = new Decoder();
        decoder.update({
          canvas: tempCanvas,
          tiles,
          palette,
          lockFrame,
          invertPalette,
        });
      } else {
        const decoder = new RGBNDecoder();
        decoder.update({
          canvas: tempCanvas,
          tiles,
          palette,
          lockFrame,
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`error in GameBoyImage: ${error.message}`);
    }

    applyRotation(tempCanvas, canvas.current, rotation);

  }, [tiles, palette, lockFrame, invertPalette, rotation]);

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
        className={classnames('gameboy-image__image', {
          'gameboy-image__image--as-thumb': asThumb,
          'gameboy-image__image--min-size': tiles.length <= 360,
        })}
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
