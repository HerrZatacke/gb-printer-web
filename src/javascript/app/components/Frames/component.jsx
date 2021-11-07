import React from 'react';
import PropTypes from 'prop-types';

const Palettes = (props) => (
  <ul className="frames">
    {
      props.frames.map((frame) => (
        <pre>
          {JSON.stringify(frame, null, 2)}
        </pre>
      ))
    }
  </ul>
);

Palettes.propTypes = {
  frames: PropTypes.array.isRequired,
};

Palettes.defaultProps = {
};

export default Palettes;
