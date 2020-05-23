import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Decoder from '../../../tools/Decoder';
import RGBNDecoder from '../../../tools/RGBNDecoder';

class GameBoyImage extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = null;

    this.failed = false;

    if (props.isRGBN && !props.rgbnPalette) {
      this.failed = 'Palette missing for RGBN image';
    }

    if (!props.isRGBN && !props.palette) {
      this.failed = 'Palette missing for image';
    }
  }

  componentDidUpdate() {
    this.updateCanvasContent();
  }

  updateCanvasContent() {
    if (this.props.isRGBN) {
      const decoder = new RGBNDecoder();
      decoder.update(this.canvasRef, this.props.tiles, this.props.rgbnPalette);
    } else {
      const decoder = new Decoder();
      decoder.update(this.canvasRef, this.props.tiles, this.props.palette);
    }
  }

  render() {
    return this.failed ? (
      <span>{this.failed}</span>
    ) : (
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
  rgbnPalette: PropTypes.object,
  isRGBN: PropTypes.bool,
};

GameBoyImage.defaultProps = {
  isRGBN: false,
  rgbnPalette: null,
};

export default GameBoyImage;
