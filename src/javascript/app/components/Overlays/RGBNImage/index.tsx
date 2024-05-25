import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import GalleryImageButtons from '../../GalleryImageButtons';
import ImageRender from '../../ImageRender';
import { defaultRGBNPalette } from '../../../defaults';
import { State } from '../../../store/State';
import { ButtonOption } from '../../GalleryImageButtons/useGalleryImageButtons';

import './index.scss';
import getRGBNFrames from '../../../../tools/getRGBNFrames';

const RGBNImage = () => {
  const { hashes, frames } = useSelector((state: State) => ({
    hashes: state.rgbnImages,
    frames: getRGBNFrames(state, state.rgbnImages || undefined),
  }));

  return hashes ? (
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
        buttons={[ButtonOption.SAVE_RGBN_IMAGE]}
        isFavourite={false}
      />
    </div>
  ) : null;
};

export default RGBNImage;
