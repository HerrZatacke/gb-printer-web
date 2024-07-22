import React, { useState } from 'react';
import dayjs from 'dayjs';
import classnames from 'classnames';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SVG from '../SVG';
import PluginSelect from '../PluginSelect';
import { ButtonOption, useGalleryImageButtons } from './useGalleryImageButtons';

import './index.scss';

dayjs.extend(customParseFormat);

interface Props {
  hash: string,
  buttons: ButtonOption[],
  isFavourite: boolean,
  imageTitle?: string,
  tags: string[],
}

function GalleryImageButtons({ hash, buttons, isFavourite, imageTitle, tags }: Props) {
  const [pluginsActive, setPluginsActive] = useState(false);

  const {
    canShare,
    isSelected,
    hasPlugins,
    deleteImage,
    setLightboxImage,
    shareImage,
    startDownload,
    updateImageToSelection,
    updateFavouriteTag,
    editImage,
  } = useGalleryImageButtons({ hash, imageTitle, tags });

  return (
    <div
      className="gallery-image-buttons"
      onClick={(ev) => {
        ev.stopPropagation();
      }}
      onMouseLeave={() => setPluginsActive(false)}
      role="presentation"
    >
      {buttons.includes(ButtonOption.SELECT) ? (
        <button
          type="button"
          className={
            classnames('gallery-image-buttons__button', {
              'gallery-image-buttons__button--unchecked': !isSelected,
              'gallery-image-buttons__button--checked': isSelected,
            })
          }
          onClick={() => updateImageToSelection(isSelected ? 'remove' : 'add')}
          title={isSelected ? 'Remove from selection' : 'Add to selection'}
        >
          <SVG name="checkmark" />
        </button>
      ) : null}
      {buttons.includes(ButtonOption.EDIT) ? (
        <button
          type="button"
          className="gallery-image-buttons__button"
          onClick={editImage}
          title="Edit"
        >
          <SVG name="edit" />
        </button>
      ) : null}
      {buttons.includes(ButtonOption.DOWNLOAD) ? (
        <button
          type="button"
          className="gallery-image-buttons__button"
          onClick={startDownload}
          title="Download"
        >
          <SVG name="download" />
        </button>
      ) : null}
      {buttons.includes(ButtonOption.DELETE) ? (
        <button
          type="button"
          className="gallery-image-buttons__button"
          onClick={deleteImage}
          title="Delete"
        >
          <SVG name="delete" />
        </button>
      ) : null}
      {buttons.includes(ButtonOption.VIEW) ? (
        <button
          type="button"
          className="gallery-image-buttons__button"
          onClick={setLightboxImage}
          title="View in Lightbox"
        >
          <SVG name="view" />
        </button>
      ) : null}
      {hasPlugins ? (
        <PluginSelect
          pluginsActive={pluginsActive}
          hash={hash}
        >
          <button
            type="button"
            className="gallery-image-buttons__button"
            onClick={(ev) => {
              ev.stopPropagation();
              setPluginsActive(true);
            }}
            title="Use Plugin"
          >
            <SVG name="plug" />
          </button>
        </PluginSelect>
      ) : null}
      {buttons.includes(ButtonOption.SHARE) && canShare ? (
        <button
          type="button"
          className="gallery-image-buttons__button"
          onClick={shareImage}
          title="Share"
        >
          <SVG name="share" />
        </button>
      ) : null}
      {buttons.includes(ButtonOption.FAVOURITE) ? (
        <button
          type="button"
          className={
            classnames('gallery-image-buttons__button', {
              'gallery-image-buttons__button--unchecked': !isFavourite,
              'gallery-image-buttons__button--favourite': isFavourite,
            })
          }
          onClick={() => updateFavouriteTag(!isFavourite)}
          title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          {isFavourite ? '❤️' : <SVG name="fav" />}
        </button>
      ) : null}
    </div>
  );
}

export default GalleryImageButtons;
