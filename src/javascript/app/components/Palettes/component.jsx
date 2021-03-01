import React from 'react';
import PropTypes from 'prop-types';
import Palette from '../Palette';

const Palettes = (props) => (
  <ul className="palettes">
    {
      props.palettes.map((palette) => (
        <Palette
          key={palette.shortName}
          name={palette.name}
          isPredefined={palette.isPredefined || false}
          shortName={palette.shortName}
          palette={palette.palette}
        />
      ))
    }
  </ul>
);

Palettes.propTypes = {
  palettes: PropTypes.array.isRequired,
};

Palettes.defaultProps = {
};

export default Palettes;
