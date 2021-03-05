import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';
import { load } from '../../../tools/storage';
import RGBNDecoder from '../../../tools/RGBNDecoder';

const ImageRender = ({
  hash,
  hashes,
  frame,
  frames,
  lockFrame,
  invertPalette,
  palette,
}) => {
  const [tiles, setTiles] = useState(null);

  // ToDo: use import loadImageTiles from '../../../tools/loadImageTiles';
  useEffect(() => {
    setTiles(null);

    if (hashes) {
      Promise.all([
        load(hashes.r, frames.r),
        load(hashes.g, frames.g),
        load(hashes.b, frames.b),
        load(hashes.n, frames.n),
      ])
        .then((newTiles) => {
          setTiles(RGBNDecoder.rgbnTiles(newTiles));
        });
    } else {
      load(hash, frame)
        .then(setTiles);
    }
  }, [hash, hashes]);


  return tiles ? (
    <GameBoyImage
      lockFrame={lockFrame}
      invertPalette={invertPalette}
      tiles={tiles}
      palette={{ palette }}
    />
  ) : null;
};

ImageRender.propTypes = {
  hash: PropTypes.string.isRequired,
  hashes: PropTypes.object,
  palette: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  invertPalette: PropTypes.bool.isRequired,
  frame: PropTypes.string,
  frames: PropTypes.object,
  lockFrame: PropTypes.bool.isRequired,
};

ImageRender.defaultProps = {
  hashes: null,
  frame: null,
  frames: null,
};

export default ImageRender;
