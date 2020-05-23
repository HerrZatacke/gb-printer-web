import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import { load } from '../../../tools/storage';
import GalleryImageButtons from '../GalleryImageButtons';

const DEFAULT_PALETTE = {
  r: [0x00, 0x55, 0xaa, 0xff],
  g: [0x00, 0x55, 0xaa, 0xff],
  b: [0x00, 0x55, 0xaa, 0xff],
  n: [0x00, 0x55, 0xaa, 0xff],
};

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
          this.rgbnDecoder.update(this.canvasRef, tiles, DEFAULT_PALETTE);
        }
      });
  }

  render() {
    const hasTiles = (this.props.tilesR || this.props.tilesG || this.props.tilesB || this.props.tilesN);
    return (
      <div
        className={
          classnames('rgbn-image', {
            'rgbn-image--has-tiles': hasTiles,
          })
        }
      >
        { hasTiles ? (
          <canvas
            width={160}
            ref={(node) => {
              this.canvasRef = node;
              if (node) {
                this.updateCanvasContent();
              }
            }}
          />
        ) : null }
        <GalleryImageButtons hash="newRGBN" buttons={['saveRGBNImage']} />
      </div>
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
  tilesR: null,
  tilesG: null,
  tilesB: null,
  tilesN: null,
};

export default RGBNImage;
