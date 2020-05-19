import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SVG from '../SVG';

dayjs.extend(customParseFormat);

const GalleryImageButtons = (props) => (
  <div className="gallery-image-buttons">
    <button
      type="button"
      className="gallery-image-buttons__button"
      onClick={props.startDownload}
    >
      <SVG name="download" />
    </button>
    <button
      type="button"
      className="gallery-image-buttons__button"
      onClick={props.deleteImage}
    >
      <SVG name="delete" />
    </button>
    <button
      type="button"
      className="gallery-image-buttons__button"
      onClick={props.editImage}
    >
      <SVG name="edit" />
    </button>
  </div>
);

GalleryImageButtons.propTypes = {
  deleteImage: PropTypes.func.isRequired,
  editImage: PropTypes.func.isRequired,
  startDownload: PropTypes.func.isRequired,
};

GalleryImageButtons.defaultProps = {
};

export default GalleryImageButtons;
