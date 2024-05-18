import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import Decoder from '../../../tools/Decoder';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import { applyRotation, Rotation } from '../../../tools/applyRotation';
import { RGBNPalette } from '../../../../types/Image';
import { RGBNTile } from '../../../tools/Decoder/types';
import './index.scss';

interface GameBoyImageProps {
  palette?: string[] | RGBNPalette | null,
  tiles: string[] | RGBNTile[],
  lockFrame: boolean,
  invertPalette: boolean,
  asThumb?: boolean,
  rotation?: Rotation,
}

const GameBoyImage: React.FC<GameBoyImageProps> = ({
  palette = null,
  tiles,
  lockFrame,
  invertPalette,
  asThumb = false,
  rotation = Rotation.DEG_0,
}) => {

  const canvas = useRef(null);
  const [decoderError, setDecoderError] = useState('');

  useEffect(() => {
    if (!palette || !tiles) {
      return;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 160;
    tempCanvas.height = 144;

    try {
      if (palette instanceof Array) {
        const decoder = new Decoder();
        decoder.update({
          canvas: tempCanvas,
          tiles: tiles as string[],
          palette,
          lockFrame,
          invertPalette,
        });
      } else {
        const decoder = new RGBNDecoder();
        decoder.update({
          canvas: tempCanvas,
          tiles: tiles as RGBNTile[],
          palette,
          lockFrame,
        });
      }

      if (canvas.current) {
        applyRotation(tempCanvas, canvas.current, rotation || Rotation.DEG_0);
      }

      setDecoderError('');
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setDecoderError(error.message);
      }
    }

  }, [tiles, palette, lockFrame, invertPalette, rotation]);

  return (
    <div
      className={
        classnames('gameboy-image', {
          'gameboy-image--rot-90': rotation === Rotation.DEG_90,
          'gameboy-image--rot-180': rotation === Rotation.DEG_180,
          'gameboy-image--rot-270': rotation === Rotation.DEG_270,
        })
      }
    >
      { decoderError ? (
        <p className="gameboy-image__error">{ decoderError }</p>
      ) : (
        <canvas
          className={classnames('gameboy-image__image', {
            'gameboy-image__image--as-thumb': asThumb,
            'gameboy-image__image--min-size': tiles.length <= 360,
          })}
          width={160}
          ref={canvas}
        />
      ) }
    </div>
  );
};

export default GameBoyImage;
