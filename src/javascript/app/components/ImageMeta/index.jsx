import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import useDateTime from '../../../hooks/useDateTime';
import './index.scss';

const rotations = [
  {
    value: 0,
    label: '0°',
  },
  {
    value: 1,
    label: '90°',
  },
  {
    value: 2,
    label: '180°',
  },
  {
    value: 3,
    label: '270°',
  },
];

const ImageMeta = ({
  created,
  updatecreated,
  meta,
  rotation,
  updateRotation,
}) => {
  const [date, time, setDate, setTime, updateDate, updateTime] = useDateTime(created, updatecreated);

  return (
    <div className="image-meta-form">
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
      <div className="image-meta-form__rotation">
        <span className="image-meta-form__label-text">
          Edit Rotation
        </span>
        <div className="inputgroup buttongroup">
          {
            rotations.map(({ value, label }) => (
              <button
                key={label}
                type="button"
                className={classnames('button image-meta-form__rotation-button', {
                  'button--active': value === (rotation || 0),
                })}
                onClick={() => {
                  updateRotation(value);
                }}
              >
                { label }
              </button>
            ))
          }
        </div>
      </div>
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
