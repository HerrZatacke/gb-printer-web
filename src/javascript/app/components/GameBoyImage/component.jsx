import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Decoder from '../../../tools/Decoder';

class GameBoyImage extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = null;
    this.decoder = new Decoder();
  }

  componentDidUpdate() {
    this.updateCanvasContent();
  }

  updateCanvasContent() {
    this.decoder.update(this.canvasRef, this.props.palette, this.props.tiles);
  }

  render() {
    return (
      <canvas
        className="gameboy-image"
        width={160}
        ref={(node) => {
          this.canvasRef = node;
          if (node) {
            this.updateCanvasContent();
          }
        }}
      />
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
