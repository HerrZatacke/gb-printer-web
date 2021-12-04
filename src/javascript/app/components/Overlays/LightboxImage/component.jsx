import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { dateFormat, dateFormatReadable } from '../../../defaults';
import SVG from '../../SVG';
import Lightbox from '../../Lightbox';
import ImageRender from '../../ImageRender';

const LightboxImage = ({
  close,
  title,
  isFullscreen,
  fullscreen,
  lockFrame,
  invertPalette,
  palette,
  frame,
  frames,
  hash,
  hashes,
  prev,
  lightboxIndex,
  size,
  next,
  created,
}) => (
  <Lightbox
    className="lightbox-image"
    deny={close}
  >
    <label className="lightbox-image__title">
      {title}
    </label>
    { isFullscreen ? null : (
      <button
        type="button"
        className="lightbox-image__button lightbox-image__button--fullscreen"
        onClick={fullscreen}
      >
        <SVG name="fullscreen" />
      </button>
    ) }
    <button
      type="button"
      className="lightbox-image__button lightbox-image__button--close"
      onClick={close}
    >
      <SVG name="close" />
    </button>
    <ImageRender
      lockFrame={lockFrame}
      invertPalette={invertPalette}
      palette={palette?.palette || palette}
      frameId={frame}
      frames={frames}
      hash={hash}
      hashes={hashes}
    />
    <div className="lightbox-image__navigation">
      { lightboxIndex > 0 ? (
        <button
          type="button"
          className="lightbox-image__button lightbox-image__button--left"
          onClick={prev}
        >
          <SVG name="left" />
        </button>
      ) : null }
      { lightboxIndex < size - 1 ? (
        <button
          type="button"
          className="lightbox-image__button lightbox-image__button--right"
          onClick={next}
        >
          <SVG name="right" />
        </button>
      ) : null }
    </div>
    <div className="lightbox-image__created">
      {dayjs(created, dateFormat).format(dateFormatReadable)}
    </div>
  </Lightbox>
);

LightboxImage.propTypes = {
  created: PropTypes.string,
  hash: PropTypes.string,
  hashes: PropTypes.object,
  palette: PropTypes.object,
  invertPalette: PropTypes.bool.isRequired,
  frame: PropTypes.string,
  frames: PropTypes.object,
  lockFrame: PropTypes.bool.isRequired,
  title: PropTypes.string,
  close: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  fullscreen: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  lightboxIndex: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
};

LightboxImage.defaultProps = {
  created: null,
  hash: null,
  hashes: null,
  palette: null,
  title: null,
  frame: null,
  frames: null,
};

export default LightboxImage;
