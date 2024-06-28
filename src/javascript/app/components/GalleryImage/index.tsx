import React from 'react';
import dayjs from 'dayjs';
import classnames from 'classnames';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import GalleryImageButtons from '../GalleryImageButtons';
import RGBNSelect from '../RGBNSelect';
import ImageRender from '../ImageRender';
import DateSpan from './DateSpan';
import TagsList from './TagsList';
import SVG from '../SVG';
import { SelectionEditMode, useGalleryImage } from './useGalleryImage';
import { ButtonOption } from '../GalleryImageButtons/useGalleryImageButtons';
import type { RGBNHashes } from '../../../../types/Image';

import './index.scss';

dayjs.extend(customParseFormat);

interface Props {
  type: 'list' | 'default',
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

function GalleryImage({ page, hash, type }: Props) {
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

  return type === 'default' ? (
    <li
      className={
        classnames('gallery-image', {
          'gallery-image--selected': isSelected,
        })
      }
      onClick={handleCellClick}
      role="presentation"
    >
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
        <span className="gallery-image__hash-debug">
          { hash }
          { hashes ? Object.keys(hashes).map((channel) => (
            <span key={channel}>
              <br />
              {`${channel.toUpperCase()}: ${hashes[channel as keyof RGBNHashes]}`}
            </span>
          )) : null }
        </span>
      ) : null }
      <GalleryImageButtons
        isFavourite={isFavourite}
        hash={hash}
        imageTitle={title}
        buttons={buttons}
      />
    </li>
  ) : (
    <li
      className={
        classnames('gallery-list-image', {
          'gallery-list-image--selected': isSelected,
        })
      }
      onClick={handleCellClick}
      role="presentation"
    >
      <div className="gallery-list-image__cell gallery-list-image__cell-image">
        <div className="gallery-list-image__image">
          <div className="gallery-list-image__image--scale">
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
        </div>
      </div>

      <div className="gallery-list-image__cell gallery-list-image__cell-description">
        <div className="gallery-list-image__description">
          <span className="gallery-list-image__title">
            {title}
          </span>
          <DateSpan
            className="gallery-image__created"
            hideDate={hideDate}
            created={created}
            preferredLocale={preferredLocale}
          />
        </div>
      </div>

      <div className="gallery-list-image__cell gallery-list-image__cell-tags">
        <TagsList tags={tags} />
      </div>

      <div className="gallery-list-image__cell gallery-list-image__cell-rgbn">
        { hashes ? null : (
          <RGBNSelect hash={hash} />
        )}
      </div>

      <div className="gallery-list-image__cell gallery-list-image__cell-buttons">
        <GalleryImageButtons
          isFavourite={isFavourite}
          hash={hash}
          imageTitle={title}
          buttons={buttons}
        />
      </div>
    </li>
  );
}

export default GalleryImage;
