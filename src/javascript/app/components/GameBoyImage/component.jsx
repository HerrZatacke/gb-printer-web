import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Decoder from '../../../tools/Decoder';
import RGBNDecoder from '../../../tools/RGBNDecoder';

class GameBoyImage extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.updateCanvasContent();
  }

  componentDidUpdate() {
    this.updateCanvasContent();
  }

  updateCanvasContent() {
    if (!this.props.palette) {
      return;
    }


    try {
      if (this.props.palette.length) {
        const decoder = new Decoder();
        decoder.update({
          canvas: this.canvasRef.current,
          tiles: this.props.tiles,
          palette: this.props.palette,
          lockFrame: this.props.lockFrame,
          invertPalette: this.props.invertPalette,
        });
      } else {
        const decoder = new RGBNDecoder();
        decoder.update({
          canvas: this.canvasRef.current,
          tiles: this.props.tiles,
          palette: this.props.palette,
          lockFrame: this.props.lockFrame,
        });
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
        ref={this.canvasRef}
      />
    );
  }
}

GameBoyImage.propTypes = {
  tiles: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.object),
  ]).isRequired,
  palette: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  lockFrame: PropTypes.bool.isRequired,
  invertPalette: PropTypes.bool.isRequired,
};

GameBoyImage.defaultProps = {
  palette: null,
};

export default GameBoyImage;
