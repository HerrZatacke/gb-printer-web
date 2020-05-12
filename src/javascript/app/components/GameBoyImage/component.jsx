import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Decoder from '../../../tools/Decoder';

class GameBoyImage extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();
    this.decoder = new Decoder();
  }

  componentDidUpdate() {
    this.decoder.update(this.canvasRef.current, this.props.palette, this.props.tiles);
  }

  render() {
    return (
      <canvas className="gameboy-image" width={160} ref={this.canvasRef} />
    );
  }
}

GameBoyImage.propTypes = {
  tiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  palette: PropTypes.array.isRequired,
};

GameBoyImage.defaultProps = {
};

export default GameBoyImage;
