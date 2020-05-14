import React from 'react';
import PropTypes from 'prop-types';

const PaletteSelect = (props) => (
  <select
    className="palette-select"
    value={props.value}
    onChange={(ev) => {
      props.onChange(ev.target.value);
    }}
  >
    {
      props.palettes.map(({ shortName, name }) => (
        <option
          key={shortName}
          value={shortName}
        >
          { name }
        </option>
      ))
    }
  </select>
);

PaletteSelect.propTypes = {
  palettes: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

PaletteSelect.defaultProps = {};

export default PaletteSelect;
