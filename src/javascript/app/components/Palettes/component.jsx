import React from 'react';
import PropTypes from 'prop-types';
import Palette from '../Palette';

const Palettes = (props) => (
  <table className="palettes">
    <thead>
      <tr className="palettes__row">
        <th className="palettes__shortname">Short</th>
        <th className="palettes__name">Name</th>
        <th className="palettes__color">Color 0</th>
        <th className="palettes__color">Color 1</th>
        <th className="palettes__color">Color 2</th>
        <th className="palettes__color">Color 3</th>
      </tr>
    </thead>
    <tbody>
      {
        props.palettes.map((palette) => (
          <Palette
            key={palette.shortName}
            name={palette.name}
            shortName={palette.shortName}
            palette={palette.palette}
          />
        ))
      }
    </tbody>
  </table>
);

Palettes.propTypes = {
  palettes: PropTypes.array.isRequired,
};

Palettes.defaultProps = {
};

export default Palettes;
