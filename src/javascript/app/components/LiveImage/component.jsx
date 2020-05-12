import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import GameBoyImage from '../GameBoyImage';

const LiveImage = (props) => (
  <div className={
    classnames('live-image', {
      'live-image--receiving': props.tiles.length,
    })
  }
  >
    <Link to="/gallery">
      <GameBoyImage palette={props.palette} tiles={props.tiles} />
    </Link>
  </div>
);

LiveImage.propTypes = {
  tiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  palette: PropTypes.array.isRequired,
};

LiveImage.defaultProps = {
};

export default LiveImage;
