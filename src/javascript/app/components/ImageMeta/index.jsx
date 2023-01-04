import React from 'react';
import PropTypes from 'prop-types';
import useDateTime from '../../../hooks/useDateTime';
import './index.scss';
import Input from '../Input';

const ImageMeta = ({
  created,
  updatecreated,
  meta,
  rotation,
  updateRotation,
}) => {
  const [date, time, setDate, setTime, updateDate, updateTime] = useDateTime(created, updatecreated);

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
      <Input
        type="number"
        min={0}
        max={3}
        value={rotation || 0}
        onChange={(value) => updateRotation(parseInt(value, 10))}
        labelText="Rotation"
        id="rotation"
      />
      {
        (meta ? (
          <pre className="image-meta-form__pre">
            { JSON.stringify(meta, null, 2) }
          </pre>
        ) : null)
      }
    </div>
  );
};

ImageMeta.propTypes = {
  created: PropTypes.string,
  updatecreated: PropTypes.func.isRequired,
  meta: PropTypes.object,
  rotation: PropTypes.number,
  updateRotation: PropTypes.func.isRequired,
};

ImageMeta.defaultProps = {
  created: null,
  meta: {},
  rotation: null,
};

export default ImageMeta;
