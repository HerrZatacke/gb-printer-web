import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import GameBoyImage from '../GameBoyImage';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import { load } from '../../../tools/storage';
import { dateFormat, dateFormatReadable } from '../../defaults';
import SVG from '../SVG';
import Lightbox from '../Lightbox';

class LightboxImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tiles: null,
      loaded: false,
      hash: props.hash,
    };
  }

  static getDerivedStateFromProps(props, state) {
    // same image
    if (props.hash === state.hash) {
      return state;
    }

    // image changed or was unloaded
    return {
      tiles: null,
      loaded: false,
      hash: props.hash,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hash !== this.props.hash && this.props.hash) {

      if (this.props.hashes) {
        Promise.all([
          load(this.props.hashes.r, this.props.frames.r),
          load(this.props.hashes.g, this.props.frames.g),
          load(this.props.hashes.b, this.props.frames.b),
          load(this.props.hashes.n, this.props.frames.n),
        ])
          .then((tiles) => {
            this.setState({
              tiles: RGBNDecoder.rgbnTiles(tiles),
              loaded: true,
            });
          });
      } else {
        load(this.props.hash, this.props.frame)
          .then((tiles) => {
            this.setState({
              tiles,
              loaded: true,
            });
          });
      }

    }
  }

  render() {
    return (this.state.loaded) ? (
      <Lightbox
        className="lightbox-image"
        deny={this.props.close}
      >
        <label className="lightbox-image__title">
          {this.props.title}
        </label>
        { this.props.isFullscreen ? null : (
          <button
            type="button"
            className="lightbox-image__button lightbox-image__button--fullscreen"
            onClick={this.props.fullscreen}
          >
            <SVG name="fullscreen" />
          </button>
        ) }
        <button
          type="button"
          className="lightbox-image__button lightbox-image__button--close"
          onClick={this.props.close}
        >
          <SVG name="close" />
        </button>
        <GameBoyImage
          tiles={this.state.tiles}
          palette={this.props.palette}
          lockFrame={this.props.lockFrame}
          invertPalette={this.props.invertPalette}
        />
        <div className="lightbox-image__navigation">
          { this.props.lightboxIndex > 0 ? (
            <button
              type="button"
              className="lightbox-image__button lightbox-image__button--left"
              onClick={this.props.prev}
            >
              <SVG name="left" />
            </button>
          ) : null }
          { this.props.lightboxIndex < this.props.size - 1 ? (
            <button
              type="button"
              className="lightbox-image__button lightbox-image__button--right"
              onClick={this.props.next}
            >
              <SVG name="right" />
            </button>
          ) : null }
        </div>
        <div className="lightbox-image__created">
          {dayjs(this.props.created, dateFormat).format(dateFormatReadable)}
        </div>
      </Lightbox>
    ) : null;
  }
}

LightboxImage.propTypes = {
  created: PropTypes.string,
  hash: PropTypes.string,
  hashes: PropTypes.object,
  palette: PropTypes.object,
  invertPalette: PropTypes.bool.isRequired,
  frame: PropTypes.string,
  frames: PropTypes.object,
  lockFrame: PropTypes.bool.isRequired,
  title: PropTypes.string,
  close: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  fullscreen: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  lightboxIndex: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
};

LightboxImage.defaultProps = {
  created: null,
  hash: null,
  hashes: null,
  palette: null,
  title: null,
  frame: null,
  frames: null,
};

export default LightboxImage;
