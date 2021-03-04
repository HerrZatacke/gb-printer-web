import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  id,
  labelText,
  type,
  min,
  max,
  value,
  onChange,
  onBlur,
}) => (
  <div className="inputgroup">
    <label
      htmlFor={id}
      className="inputgroup__label"
    >
      {labelText}
    </label>
    <input
      id={id}
      className="inputgroup__input"
      type={type}
      min={type === 'number' ? min : null}
      max={type === 'number' ? max : null}
      value={value}
      onChange={({ target: { value: newVal } }) => {
        onChange(newVal);
      }}
      onBlur={onBlur}
    />
  </div>
);

Input.propTypes = {
  id: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'number']),
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
};

Input.defaultProps = {
  type: 'text',
  min: null,
  max: null,
  onBlur: null,
};

export default Input;
