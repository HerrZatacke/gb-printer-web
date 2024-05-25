import React from 'react';
import dayjs from 'dayjs';
import { dateFormat } from '../../../defaults';
import dateFormatLocale from '../../../../tools/dateFormatLocale';
import SVG from '../../SVG';
import Lightbox from '../../Lightbox';
import ImageRender from '../../ImageRender';
import { useLightboxImage } from './useLightboxImage';

import './index.scss';

const LightboxImage = () => {
  const {
    title,
    isFullscreen,
    lockFrame,
    invertPalette,
    palette,
    frame,
    frames,
    hash,
    hashes,
    lightboxIndex,
    size,
    created,
    preferredLocale,
    rotation,
    prev,
    next,
    fullscreen,
    close,
  } = useLightboxImage();

  return (
    <Lightbox
      className="lightbox-image"
      deny={close}
    >
      <label className="lightbox-image__title">
        {title}
      </label>
      {isFullscreen ? null : (
        <button
          type="button"
          className="lightbox-image__button lightbox-image__button--fullscreen"
          onClick={fullscreen}
        >
          <SVG name="fullscreen" />
        </button>
      )}
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
        palette={palette}
        frameId={frame}
        frames={frames}
        hash={hash}
        hashes={hashes}
        rotation={rotation}
      />
      <div className="lightbox-image__navigation">
        {lightboxIndex > 0 ? (
          <button
            type="button"
            className="lightbox-image__button lightbox-image__button--left"
            onClick={prev}
          >
            <SVG name="left" />
          </button>
        ) : null}
        {lightboxIndex < size - 1 ? (
          <button
            type="button"
            className="lightbox-image__button lightbox-image__button--right"
            onClick={next}
          >
            <SVG name="right" />
          </button>
        ) : null}
      </div>
      <div className="lightbox-image__created">
        {dateFormatLocale(dayjs(created, dateFormat), preferredLocale)}
      </div>
    </Lightbox>
  );
};

export default LightboxImage;
