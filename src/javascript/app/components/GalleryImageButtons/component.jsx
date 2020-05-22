import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SVG from '../SVG';

dayjs.extend(customParseFormat);

const GalleryImageButtons = (props) => (
  <div className="gallery-image-buttons">
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
    { props.editImage ? (
      <button
        type="button"
        className="gallery-image-buttons__button"
        onClick={props.editImage}
      >
        <SVG name="edit" />
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
  </div>
);

GalleryImageButtons.propTypes = {
  deleteImage: PropTypes.func,
  editImage: PropTypes.func,
  startDownload: PropTypes.func,
  saveRGBNImage: PropTypes.func,
};

GalleryImageButtons.defaultProps = {
  deleteImage: null,
  editImage: null,
  startDownload: null,
  saveRGBNImage: null,
};

export default GalleryImageButtons;
