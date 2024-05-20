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
  hash,
  hashes,
  updatecreated,
  meta,
  rotation,
  updateRotation,
}) => {
  const { date, time, setDate, setTime, updateDate, updateTime } = useDateTime(created, updatecreated);

  const tableData = {
    ...meta,
    hash,
  };

  const table = Object.keys(tableData)
    .reduce((data, key) => {
      let value = tableData[key];

      // Possibly nested or boolean properties
      if (typeof value !== 'number' && typeof value !== 'string') {
        value = JSON.stringify(value);
      }

      const row = {
        key,
        value,
      };

      return [
        ...data,
        row,
      ];
    }, []);

  if (hashes) {
    const channelHashes = ['r', 'g', 'b', 'n']
      .map((channel) => {
        if (!hashes[channel]) {
          return null;
        }

        return ({
          key: `hash ${channel}`,
          value: hashes[channel],
        });
      })
      .filter(Boolean);
    table.push(...channelHashes);
  }

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
      <table
        className="image-meta-form__meta-table"
      >
        <tbody>
          {
            table.map(({ key, value }) => (
              <tr key={key}>
                <td
                  className="image-meta-form__meta-cell image-meta-form__meta-cell--key"
                >
                  { key }
                </td>
                <td
                  className="image-meta-form__meta-cell image-meta-form__meta-cell--value"
                >
                  { value }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

ImageMeta.propTypes = {
  created: PropTypes.string,
  hash: PropTypes.string.isRequired,
  hashes: PropTypes.object,
  updatecreated: PropTypes.func.isRequired,
  meta: PropTypes.object,
  rotation: PropTypes.number,
  updateRotation: PropTypes.func.isRequired,
};

ImageMeta.defaultProps = {
  created: null,
  meta: {},
  rotation: null,
  hashes: null,
};

export default ImageMeta;
