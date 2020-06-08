import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import GameBoyImage from '../GameBoyImage';

const LiveImage = (props) => (
  <div
    className={
      classnames('live-image', {
        'live-image--receiving': props.tiles.length,
      })
    }
  >
    <GameBoyImage palette={props.palette} tiles={props.tiles} lockFrame={false} />
  </div>
);

LiveImage.propTypes = {
  tiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  palette: PropTypes.object.isRequired,
};

LiveImage.defaultProps = {
};

export default LiveImage;
