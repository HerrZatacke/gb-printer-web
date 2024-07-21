import React from 'react';
import dayjs from 'dayjs';
import classnames from 'classnames';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import GalleryImageButtons from '../GalleryImageButtons';
import ImageRender from '../ImageRender';
import DateSpan from './DateSpan';
import TagsList from './TagsList';
import SVG from '../SVG';
import { SelectionEditMode, useGalleryImage } from './useGalleryImage';
import { ButtonOption } from '../GalleryImageButtons/useGalleryImageButtons';

import './index.scss';

dayjs.extend(customParseFormat);

interface Props {
  hash: string,
  page: number,
}

const buttons = [
  ButtonOption.SELECT,
  ButtonOption.FAVOURITE,
  ButtonOption.DOWNLOAD,
  ButtonOption.DELETE,
  ButtonOption.VIEW,
  ButtonOption.SHARE,
  ButtonOption.PLUGINS,
];

function GalleryImage({ page, hash }: Props) {
  const {
    galleryImageData,
    updateImageSelection,
    editImage,
  } = useGalleryImage(hash);

  if (!galleryImageData) {
    return null;
  }

  const {
    created,
    hashes,
    palette,
    invertPalette,
    frame,
    lockFrame,
    title,
    tags,
    isFavourite,
    isSelected,
    hideDate,
    preferredLocale,
    meta,
    rotation,
    enableDebug,
  } = galleryImageData;

  const handleCellClick = (ev: React.MouseEvent) => {
    if (ev.ctrlKey || ev.shiftKey) {
      ev.preventDefault();
      updateImageSelection(isSelected ? SelectionEditMode.REMOVE : SelectionEditMode.ADD, ev.shiftKey, page);
    } else {
      editImage(tags);
    }
  };

  return (
    <li
      className={
        classnames('gallery-image', {
          'gallery-image--selected': isSelected,
        })
      }
      onClick={handleCellClick}
      role="presentation"
    >
      <GalleryImageButtons
        isFavourite={isFavourite}
        hash={hash}
        imageTitle={title}
        buttons={buttons}
      />
      <div className="gallery-image__image">
        <ImageRender
          lockFrame={lockFrame}
          invertPalette={invertPalette}
          palette={palette}
          frameId={frame}
          hash={hash}
          hashes={hashes}
          rotation={rotation}
        />
      </div>
      {title ? (
        <span
          className="gallery-image__title"
        >
          {title}
        </span>
      ) : null}
      <TagsList tags={tags} />
      <div className="gallery-image__created-meta">
        {(
          meta ? (
            <>
              <div className="gallery-image__meta">
                <SVG name="meta" />
              </div>
              <pre className="gallery-image__meta-pre">
                { JSON.stringify(meta, null, 2) }
              </pre>
            </>
          ) : null
        )}
        <DateSpan
          className="gallery-image__created"
          hideDate={hideDate}
          created={created}
          preferredLocale={preferredLocale}
        />
      </div>
      { enableDebug ? (
        <span className="gallery-image__hash-debug">{ hash }</span>
      ) : null }
    </li>
  );
}

export default GalleryImage;
