import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import GalleryImageButtons from '../GalleryImageButtons';
import { load } from '../../../tools/storage';
import { defaultPalette } from '../../defaults';

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
      load(this.props.hashes.r, this.props.frames.r),
      load(this.props.hashes.g, this.props.frames.g),
      load(this.props.hashes.b, this.props.frames.b),
      load(this.props.hashes.n, this.props.frames.n),
    ])
      .then((rgbn) => {
        if (this.canvasRef) {
          const tiles = RGBNDecoder.rgbnTiles(rgbn);
          this.rgbnDecoder.update(this.canvasRef, tiles, defaultPalette);
        }
      });
  }

  render() {
    const hasTiles = (this.props.hashes.r || this.props.hashes.g || this.props.hashes.b || this.props.hashes.n);
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
  hashes: PropTypes.object,
  frames: PropTypes.object,
};

RGBNImage.defaultProps = {
  hashes: null,
  frames: null,
};

export default RGBNImage;
