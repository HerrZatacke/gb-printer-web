import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';

const colorIsValid = (color) => (
  color.match(/^#[0-9a-f]{6}$/i)
);

const Input = ({
  id,
  labelText,
  buttonIcon,
  buttonOnClick,
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
  const [colorVal, setColorVal] = type === 'color' ? useState(value) : [false, false];

  if (type === 'color') {
    useEffect(() => {
      setColorVal(value);
    }, [value]);
  }

  const blurListener = onBlur ? () => {
    if (setShowPass) {
      setShowPass(false);
    }

    onBlur();
  } : null;

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
        onBlur={blurListener}
      />

      {((type === 'file') ? (
        <label
          htmlFor={id}
          className="button button--label"
        >
          Select
        </label>
      ) : null)}

      {(buttonOnClick && buttonIcon) ? (
        <button
          type="button"
          className={`inputgroup__button inputgroup__button--${buttonIcon}`}
          onClick={buttonOnClick}
        >
          <SVG name={buttonIcon} />
        </button>
      ) : null}

      {((type === 'color') ? (
        <input
          type="text"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className={classnames('inputgroup__input inputgroup__input--colortext', {
            'inputgroup__input--invalid-color': !colorIsValid(colorVal),
          })}
          value={colorVal}
          disabled={disabled}
          onChange={({ target: { value: newColorVal } }) => {
            setColorVal(newColorVal);
            if (colorIsValid(newColorVal)) {
              onChange(newColorVal);
            }
          }}
          onBlur={blurListener}
        />
      ) : null)}

      {(setShowPass ? (
        <button
          type="button"
          className="inputgroup__button inputgroup__button--show-password"
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
  type: PropTypes.oneOf(['text', 'number', 'color', 'file', 'password']),
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  buttonOnClick: PropTypes.func,
  buttonIcon: PropTypes.string,
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
  buttonOnClick: null,
  buttonIcon: null,
  children: null,
};

export default Input;
