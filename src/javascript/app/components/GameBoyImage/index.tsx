import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import type { RGBNTiles, RGBNPalette } from 'gb-image-decoder';
import { RGBNDecoder, Decoder, maxTiles } from 'gb-image-decoder';
import { applyRotation, Rotation } from '../../../tools/applyRotation';
import './index.scss';

export interface GameBoyImageProps {
  palette?: string[] | RGBNPalette,
  tiles: string[] | RGBNTiles,
  lockFrame?: boolean,
  invertPalette?: boolean,
  asThumb?: boolean,
  rotation?: Rotation,
}

function GameBoyImage({
  palette,
  tiles,
  lockFrame,
  invertPalette,
  asThumb = false,
  rotation = Rotation.DEG_0,
}: GameBoyImageProps) {

  const isRGBN = !(palette instanceof Array);
  const canvas = useRef(null);
  const [decoderError, setDecoderError] = useState('');

  const isMinSize = (isRGBN ? maxTiles(tiles as RGBNTiles) : (tiles as string[]).length) <= 360;

  useEffect(() => {
    if (!palette || !tiles) {
      return;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 160;
    tempCanvas.height = 144;

    try {
      if (isRGBN) {
        const decoder = new RGBNDecoder();
        if (tiles) {
          decoder.update({
            canvas: tempCanvas,
            tiles: tiles as RGBNTiles,
            palette,
            lockFrame: lockFrame || false, // ToDo: Update package to allow optional param
          });
        }
      } else {
        const decoder = new Decoder();
        if ((tiles as string[] | undefined)?.length) {
          decoder.update({
            canvas: tempCanvas,
            tiles: tiles as string[],
            palette,
            lockFrame: lockFrame || false, // ToDo: Update package to allow optional param
            invertPalette: invertPalette || false, // ToDo: Update package to allow optional param
          });
        }
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

  }, [tiles, palette, lockFrame, invertPalette, rotation, isRGBN]);

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
            'gameboy-image__image--min-size': isMinSize,
          })}
          width={160}
          ref={canvas}
        />
      ) }
    </div>
  );
}

export default GameBoyImage;
