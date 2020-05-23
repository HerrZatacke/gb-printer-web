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
    try {
      if (this.props.palette.palette) {
        const decoder = new Decoder();
        decoder.update(this.canvasRef, this.props.tiles, this.props.palette.palette);
      } else {
        const decoder = new RGBNDecoder();
        decoder.update(this.canvasRef, this.props.tiles, this.props.palette);
      }
    } catch (error) {
      console.error(`error in GameBoyImage: ${error.message}`);
    }
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
  palette: PropTypes.object.isRequired,
};

GameBoyImage.defaultProps = {};

export default GameBoyImage;
