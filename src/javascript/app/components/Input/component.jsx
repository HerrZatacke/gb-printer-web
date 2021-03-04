import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Input = ({
  id,
  labelText,
  type,
  min,
  max,
  value,
  disabled,
  onChange,
  onBlur,
}) => (
  <div
    className={classnames('inputgroup', {
      'inputgroup--color': type === 'color',
    })}
  >
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
      disabled={!disabled}
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
  type: PropTypes.oneOf(['text', 'number', 'color']),
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
};

Input.defaultProps = {
  type: 'text',
  min: null,
  max: null,
  onBlur: null,
  disabled: false,
};

export default Input;
