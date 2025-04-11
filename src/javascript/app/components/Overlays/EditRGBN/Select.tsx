import React from 'react';
import type { DialogOption } from '../../../../../types/Dialog';

interface Props {
  id: string,
  label?: string,
  disabled: boolean,
  value: string,
  setSelected: (value: string) => void,
  options: DialogOption[],
}

function Select({ id, label, disabled, value, setSelected, options }: Props) {
  return (
    <div
      className="inputgroup"
    >
      { label ? (
        <label htmlFor={`confirm-options-${id}`} className="inputgroup__label">
          {label}
        </label>
      ) : null }
      <select
        id={`confirm-options-${id}`}
        disabled={disabled}
        className="inputgroup__input inputgroup__input--select"
        value={value}
        onChange={({ target }) => setSelected(target.value)}
      >
        {
          options.map(({ value: val, name }) => (
            <option
              value={val}
              key={val}
            >
              {name}
            </option>
          ))
        }
      </select>
    </div>
  );
}

export default Select;
