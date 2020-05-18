import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import { load } from '../../../tools/storage';

class RGBNImage extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = null;
    this.rgbnDecoder = new RGBNDecoder();
  }

  componentDidUpdate() {
    this.updateCanvasContent();
  }

  updateCanvasContent() {
    Promise.all([
      load(this.props.tilesR),
      load(this.props.tilesG),
      load(this.props.tilesB),
      load(this.props.tilesN),
    ])
      .then(([r, g, b, n]) => {
        this.rgbnDecoder.update(this.canvasRef, r, g, b, n);
      });
  }

  render() {
    return (
      (this.props.tilesR || this.props.tilesG || this.props.tilesB || this.props.tilesN) ? (
        <canvas
          className="rgbn-image"
          width={160}
          ref={(node) => {
            this.canvasRef = node;
            if (node) {
              this.updateCanvasContent();
            }
          }}
        />
      ) : null
    );
  }
}

RGBNImage.propTypes = {
  tilesR: PropTypes.string,
  tilesG: PropTypes.string,
  tilesB: PropTypes.string,
  tilesN: PropTypes.string,
};

RGBNImage.defaultProps = {
  tilesR: [],
  tilesG: [],
  tilesB: [],
  tilesN: [],
};

export default RGBNImage;
