import React from 'react';
import PropTypes from 'prop-types';

const Select = ({ id, label, disabled, value, setSelected, options }) => (
  <div
    className="inputgroup"
  >
    <label htmlFor={`confirm-options-${id}`} className="inputgroup__label">
      {label}
    </label>
    <select
      id={`confirm-options-${id}`}
      disabled={disabled}
      className="inputgroup__input inputgroup__input--select"
      value={value}
      onChange={setSelected}
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

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
};

export default Select;
