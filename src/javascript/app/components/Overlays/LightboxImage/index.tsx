import React from 'react';
import dayjs from 'dayjs';
import { dateFormat } from '../../../defaults';
import dateFormatLocale from '../../../../tools/dateFormatLocale';
import SVG from '../../SVG';
import Lightbox from '../../Lightbox';
import ImageRender from '../../ImageRender';
import { useLightboxImage } from './useLightboxImage';
import type { RGBNImage } from '../../../../../types/Image';

import './index.scss';

function LightboxImage() {
  const {
    image,
    isFullscreen,
    currentIndex,
    size,
    preferredLocale,
    canPrev,
    canNext,
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
      <h2 className="lightbox-image__header">
        <span
          className="lightbox-image__title"
        >
          { image?.title }
        </span>
        <span
          className="lightbox-image__counter"
        >
          { `${currentIndex + 1}/${size}` }
        </span>
        <button
          type="button"
          className="lightbox-image__button lightbox-image__header-button lightbox-image__button--fullscreen"
          onClick={fullscreen}
          title={isFullscreen ? 'Leave fullscreen' : 'Enter fullscreen'}
        >
          <SVG name={isFullscreen ? 'fullscreen-off' : 'fullscreen-on'} />
        </button>
        <button
          type="button"
          className="lightbox-image__button lightbox-image__header-button lightbox-image__button--close"
          onClick={close}
          title="Close"
        >
          <SVG name="close" />
        </button>
      </h2>
      { image ? (
        <ImageRender
          lockFrame={image.lockFrame}
          invertPalette={image.invertPalette}
          invertFramePalette={image.invertFramePalette}
          palette={image.palette}
          framePalette={image.framePalette}
          frameId={image.frame}
          hash={image.hash}
          hashes={(image as RGBNImage).hashes}
          rotation={image.rotation}
        />
      ) : null }
      <div className="lightbox-image__navigation">
        {canPrev ? (
          <button
            type="button"
            className="lightbox-image__button lightbox-image__nav-button lightbox-image__button--left"
            onClick={prev}
          >
            <SVG name="left" />
          </button>
        ) : null}
        {canNext ? (
          <button
            type="button"
            className="lightbox-image__button lightbox-image__nav-button lightbox-image__button--right"
            onClick={next}
          >
            <SVG name="right" />
          </button>
        ) : null}
      </div>
      <div className="lightbox-image__created">
        {dateFormatLocale(dayjs(image?.created, dateFormat), preferredLocale)}
      </div>
    </Lightbox>
  );
}

export default LightboxImage;
