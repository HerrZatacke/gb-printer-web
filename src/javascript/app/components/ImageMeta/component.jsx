import React from 'react';
import PropTypes from 'prop-types';
import useDateTime from '../../../hooks/useDateTime';

const ImageMeta = (props) => {
  const [date, time, setDate, setTime, updateDate, updateTime] = useDateTime(props.created, props.updatecreated);

  return (
    <div className="image-meta-form__datetime">
      <label
        className="image-meta-form__label image-meta-form__label--date"
      >
        <span className="image-meta-form__label-text">
          Edit Date
        </span>
        <input
          type="date"
          className="image-meta-form__date"
          value={date}
          onChange={({ target: { value } }) => {
            setDate(value);
          }}
          onBlur={({ target: { value } }) => {
            updateDate(value);
          }}
        />
      </label>
      <label
        className="image-meta-form__label image-meta-form__label--time"
      >
        <span className="image-meta-form__label-text">
          Edit Time
        </span>
        <input
          type="time"
          className="image-meta-form__date"
          value={time}
          onChange={({ target: { value } }) => {
            setTime(value);
          }}
          onBlur={({ target: { value } }) => {
            updateTime(value);
          }}
        />
      </label>
    </div>
  );
};

ImageMeta.propTypes = {
  created: PropTypes.string,
  updatecreated: PropTypes.func.isRequired,
};

ImageMeta.defaultProps = {
  created: null,
};

export default ImageMeta;
