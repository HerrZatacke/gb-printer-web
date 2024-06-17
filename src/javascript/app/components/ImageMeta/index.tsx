import React from 'react';
import classnames from 'classnames';
import useDateTime from '../../../hooks/useDateTime';
import { Rotation } from '../../../tools/applyRotation';
import { ImageMetadata, RGBNHashes } from '../../../../types/Image';

import './index.scss';

interface RotationLabel {
  value: Rotation,
  label: string,
}

interface Props {
  hash: string,
  updateCreated: (value: string) => void,
  updateRotation: (value: Rotation) => void,
  created?: string,
  hashes?: RGBNHashes,
  meta?: ImageMetadata,
  rotation?: Rotation,
}

interface TableRow {
  key: string,
  value: string,
}

const rotations: RotationLabel[] = [
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
  updateCreated,
  meta,
  rotation,
  updateRotation,
}: Props) => {
  const { date, time, setDate, setTime, updateDate, updateTime } = useDateTime(updateCreated, created);

  const tableData: ImageMetadata & { hash: string } = {
    ...meta,
    hash,
  };

  const table = Object.keys(tableData)
    .reduce((acc: TableRow[], key): TableRow[] => {
      let value: string;

      // Possibly nested or boolean properties
      if (typeof tableData[key] !== 'number' && typeof tableData[key] !== 'string') {
        value = JSON.stringify(tableData[key]);
      } else {
        value = tableData[key] as string;
      }

      const row: TableRow = {
        key,
        value,
      };
      return [...acc, row];
    }, []);

  if (hashes) {
    const channelHashes = (Object.keys(hashes) as (keyof RGBNHashes)[])
      .reduce((acc: TableRow[], channel: keyof RGBNHashes): TableRow[] => {
        const row: TableRow = {
          key: `hash ${channel}`,
          value: hashes[channel] as string,
        };
        return [...acc, row];
      }, []);
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

export default ImageMeta;
