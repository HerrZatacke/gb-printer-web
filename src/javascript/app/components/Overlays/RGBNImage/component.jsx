import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import GalleryImageButtons from '../../GalleryImageButtons';
import ImageRender from '../../ImageRender';
import { defaultRGBNPalette } from '../../../defaults';

const RGBNImage = ({ hashes, frames }) => (
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
    <GalleryImageButtons hash="newRGBN" buttons={['saveRGBNImage']} />
  </div>
);

RGBNImage.propTypes = {
  hashes: PropTypes.object,
  frames: PropTypes.object,
};

RGBNImage.defaultProps = {
  hashes: null,
  frames: null,
};

export default RGBNImage;
