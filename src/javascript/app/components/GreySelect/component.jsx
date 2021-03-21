import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import { blendModeLabels } from '../../../tools/RGBNDecoder/blendModes';
import ColorSlider from '../ColorSlider';

const GreySelect = (props) => {

  const [values, setValues] = useState(props.values);

  const debounced = useDebouncedCallback((debouncedValues) => {
    props.onChange(debouncedValues, true);
  }, 150, { leading: true, trailing: true });

  const change = (color, valueUpdate) => {
    const nextValues = {
      ...values,
      [color]: valueUpdate,
    };
    setValues(nextValues);
    debounced.callback(nextValues);
  };

  return (
    <div className="grey-select">
      <select
        className="grey-select__select"
        value={values.blend}
        onChange={(ev) => {
          change('blend', ev.target.value);
        }}
      >
        {
          blendModeLabels.map(({ id, label }) => (
            <option
              key={id}
              value={id}
            >
              {label}
            </option>
          ))
        }
      </select>
      {
        ['r', 'g', 'b', 'n']
          .map((color) => (
            <ColorSlider
              key={`slider-${color}`}
              color={color}
              values={values[color]}
              onChange={(valueChange) => {
                change(color, valueChange);
              }}
            />
          ))
      }
    </div>
  );
};

GreySelect.propTypes = {
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

GreySelect.defaultProps = {};

export default GreySelect;
