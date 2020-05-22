import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Decoder from '../../../tools/Decoder';
import RGBNDecoder from '../../../tools/RGBNDecoder';

class GameBoyImage extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = null;
  }

  componentDidUpdate() {
    this.updateCanvasContent();
  }

  updateCanvasContent() {
    const decoder = this.props.isRGBN ? new RGBNDecoder() : new Decoder();
    decoder.update(this.canvasRef, this.props.tiles, this.props.palette);
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
  tiles: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.object),
  ]).isRequired,
  palette: PropTypes.array.isRequired,
  isRGBN: PropTypes.bool,
};

GameBoyImage.defaultProps = {
  isRGBN: false,
};

export default GameBoyImage;
