import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { dateFormatInput, dateFormat } from '../../defaults';

const ImageMeta = (props) => (
  <label
    className="image-meta-form"
  >
    <span className="image-meta-form__label-text">
      Edit Date/Time
    </span>
    <input
      type="datetime-local"
      className="image-meta-form__date"
      value={props.created ? dayjs(props.created).format(dateFormatInput) : ''}
      onChange={({ target }) => {
        props.updatecreated(dayjs(target.value).format(dateFormat));
      }}
    />
  </label>
);

ImageMeta.propTypes = {
  created: PropTypes.string,
  updatecreated: PropTypes.func.isRequired,
};

ImageMeta.defaultProps = {
  created: null,
};

export default ImageMeta;
