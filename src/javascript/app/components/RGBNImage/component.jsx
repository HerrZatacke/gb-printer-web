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
      .then((rgbn) => {

        if (this.canvasRef) {
          const tiles = RGBNDecoder.rgbnTiles(rgbn);
          this.rgbnDecoder.update(this.canvasRef, tiles);

          // Test scaling of decoder
          // let childCanvas;
          // do {
          //   childCanvas = document.querySelector('body > canvas');
          //   if (childCanvas) {
          //     document.querySelector('body').removeChild(childCanvas);
          //   }
          // } while (childCanvas);
          //
          // document.querySelector('body').appendChild(this.rgbnDecoder.getScaledCanvas(3));
        }
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
