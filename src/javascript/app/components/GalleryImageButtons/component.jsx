import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import classnames from 'classnames';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SVG from '../SVG';

dayjs.extend(customParseFormat);

const GalleryImageButtons = (props) => (
  <div
    className="gallery-image-buttons"
    onClick={(ev) => {
      ev.stopPropagation();
    }}
    role="presentation"
  >
    { props.updateImageToSelection ? (
      <button
        type="button"
        className={
          classnames('gallery-image-buttons__button', {
            'gallery-image-buttons__button--unchecked': !props.isSelected,
            'gallery-image-buttons__button--checked': props.isSelected,
          })
        }
        onClick={() => props.updateImageToSelection(props.isSelected ? 'remove' : 'add')}
      >
        <SVG name="checkmark" />
      </button>
    ) : null }
    { props.startDownload ? (
      <button
        type="button"
        className="gallery-image-buttons__button"
        onClick={props.startDownload}
      >
        <SVG name="download" />
      </button>
    ) : null }
    { props.deleteImage ? (
      <button
        type="button"
        className="gallery-image-buttons__button"
        onClick={props.deleteImage}
      >
        <SVG name="delete" />
      </button>
    ) : null }
    { props.setLightboxImageIndex ? (
      <button
        type="button"
        className="gallery-image-buttons__button"
        onClick={props.setLightboxImageIndex}
      >
        <SVG name="view" />
      </button>
    ) : null }
    { props.saveRGBNImage ? (
      <button
        type="button"
        className="gallery-image-buttons__button"
        onClick={props.saveRGBNImage}
      >
        <SVG name="save" />
      </button>
    ) : null }
    { props.shareImage && props.canShare ? (
      <button
        type="button"
        className="gallery-image-buttons__button"
        onClick={props.shareImage}
      >
        <SVG name="share" />
      </button>
    ) : null }
  </div>
);

GalleryImageButtons.propTypes = {
  canShare: PropTypes.bool.isRequired,
  deleteImage: PropTypes.func,
  setLightboxImageIndex: PropTypes.func,
  isSelected: PropTypes.bool.isRequired,
  saveRGBNImage: PropTypes.func,
  shareImage: PropTypes.func,
  startDownload: PropTypes.func,
  updateImageToSelection: PropTypes.func,
};

GalleryImageButtons.defaultProps = {
  deleteImage: null,
  setLightboxImageIndex: null,
  saveRGBNImage: null,
  shareImage: null,
  startDownload: null,
  updateImageToSelection: null,
};

export default GalleryImageButtons;
