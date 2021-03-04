import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
}) => (
  <div
    className={classnames('inputgroup', {
      'inputgroup--color': type === 'color',
      'inputgroup--file': type === 'file',
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
      step={type === 'number' ? step : null}
      value={value}
      disabled={disabled}
      onChange={({ target: { value: newVal, files } }) => {
        onChange(files || newVal);
      }}
      onBlur={onBlur}
    />
    {((type === 'file' && buttonLabelText) ? (
      <label
        htmlFor={id}
        className="button button--label"
      >
        {buttonLabelText}
      </label>
    ) : null)}
  </div>
);

Input.propTypes = {
  id: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  buttonLabelText: PropTypes.string,
  type: PropTypes.oneOf(['text', 'number', 'color', 'file']),
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
};

export default Input;
