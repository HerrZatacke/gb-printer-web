import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import GalleryImageButtons from '../../GalleryImageButtons';
import ImageRender from '../../ImageRender';
import { defaultRGBNPalette } from '../../../defaults';
import getRGBNFrames from '../../../../tools/getRGBNFrames';
import './index.scss';

const RGBNImage = () => {

  const { hashes, frames } = useSelector((state) => ({
    hashes: {
      r: state.rgbnImages.r,
      g: state.rgbnImages.g,
      b: state.rgbnImages.b,
      n: state.rgbnImages.n,
    },
    frames: getRGBNFrames(state, state.rgbnImages, null),
  }));

  return (
    <div
      className={
        classnames('rgbn-image', {
          'rgbn-image--has-tiles': (
            hashes.r ||
            hashes.g ||
            hashes.b ||
            hashes.n
          ),
        })
      }
    >
      <ImageRender
        lockFrame={false}
        invertPalette={false}
        palette={defaultRGBNPalette}
        frames={frames}
        hash="newRGBN"
        hashes={hashes}
      />
      <GalleryImageButtons
        hash="newRGBN"
        buttons={['saveRGBNImage']}
        isFavourite={false}
      />
    </div>
  );
};

export default RGBNImage;
