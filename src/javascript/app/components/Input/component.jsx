import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SVG from '../SVG';

const Input = ({
  id,
  labelText,
  buttonLabelText,
  type,
  min,
  max,
  step,
  value,
  disabled,
  onChange,
  onBlur,
  children,
}) => {
  const [showPass, setShowPass] = type === 'password' ? useState(false) : [false, false];

  return (
    <div
      className={`inputgroup inputgroup--${type}`}
    >
      <label
        htmlFor={id}
        className="inputgroup__label"
      >
        {labelText}
        {children}
      </label>
      <input
        id={id}
        className="inputgroup__input"
        type={showPass ? 'text' : type}
        min={type === 'number' ? min : null}
        max={type === 'number' ? max : null}
        step={type === 'number' ? step : null}
        value={value}
        disabled={disabled}
        onChange={({ target: { value: newVal, files } }) => {
          onChange(files || newVal);
        }}
        onBlur={() => {
          if (setShowPass) {
            setShowPass(false);
          }

          onBlur();
        }}
      />

      {((type === 'file' && buttonLabelText) ? (
        <label
          htmlFor={id}
          className="button button--label"
        >
          {buttonLabelText}
        </label>
      ) : null)}

      {(setShowPass ? (
        <button
          type="button"
          className="inputgroup__show-password-button"
          onClick={() => setShowPass(!showPass)}
        >
          <SVG name="view" />
        </button>
      ) : null)}
    </div>
  );
};


Input.propTypes = {
  id: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  buttonLabelText: PropTypes.string,
  type: PropTypes.oneOf(['text', 'number', 'color', 'file', 'password']),
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

Input.defaultProps = {
  type: 'text',
  min: null,
  max: null,
  step: null,
  value: '',
  onBlur: null,
  disabled: false,
  buttonLabelText: null,
  children: null,
};

export default Input;
