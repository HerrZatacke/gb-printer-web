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
}

const GalleryImageButtons = ({ hash, buttons, isFavourite, imageTitle }: Props) => {
  const [pluginsActive, setPluginsActive] = useState(false);

  const {
    canShare,
    isSelected,
    hasPlugins,
    deleteImage,
    setLightboxImage,
    saveRGBNImage,
    shareImage,
    startDownload,
    updateImageToSelection,
    updateFavouriteTag,
  } = useGalleryImageButtons({ hash, imageTitle });

  return (
    <div
      className="gallery-image-buttons"
      onClick={(ev) => {
        ev.stopPropagation();
      }}
      role="presentation"
      onMouseLeave={() => setPluginsActive(false)}
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
        >
          <SVG name="checkmark" />
        </button>
      ) : null}
      {buttons.includes(ButtonOption.DOWNLOAD) ? (
        <button
          type="button"
          className="gallery-image-buttons__button"
          onClick={startDownload}
        >
          <SVG name="download" />
        </button>
      ) : null}
      {buttons.includes(ButtonOption.DELETE) ? (
        <button
          type="button"
          className="gallery-image-buttons__button"
          onClick={deleteImage}
        >
          <SVG name="delete" />
        </button>
      ) : null}
      {buttons.includes(ButtonOption.VIEW) ? (
        <button
          type="button"
          className="gallery-image-buttons__button"
          onClick={setLightboxImage}
        >
          <SVG name="view" />
        </button>
      ) : null}
      {buttons.includes(ButtonOption.SAVE_RGBN_IMAGE) ? (
        <button
          type="button"
          className="gallery-image-buttons__button"
          onClick={saveRGBNImage}
        >
          <SVG name="save" />
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
            onClick={() => setPluginsActive(true)}
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
        >
          {isFavourite ? '❤️' : <SVG name="fav" />}
        </button>
      ) : null}
    </div>
  );
};

export default GalleryImageButtons;
