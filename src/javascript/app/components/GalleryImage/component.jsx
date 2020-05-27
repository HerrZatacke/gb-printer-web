import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import GameBoyImage from '../GameBoyImage';
import GalleryImageButtons from '../GalleryImageButtons';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import { dateFormat, dateFormatReadable } from '../../defaults';
import { load } from '../../../tools/storage';

dayjs.extend(customParseFormat);

class GalleryImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tiles: null,
    };
  }

  componentDidMount() {
    if (this.props.hashes) {
      Promise.all([
        load(this.props.hashes.r),
        load(this.props.hashes.g),
        load(this.props.hashes.b),
        load(this.props.hashes.n),
      ])
        .then((tiles) => {
          this.setState({
            tiles: RGBNDecoder.rgbnTiles(tiles),
          });
        });
    } else {
      load(this.props.hash)
        .then((tiles) => {
          this.setState({
            tiles,
          });
        });
    }
  }

  render() {
    return (
      <li className="gallery-image">
        <button
          type="button"
          className="gallery-image__image"
          onClick={this.props.setLightboxImageIndex}
        >
          { this.state.tiles ? (
            <GameBoyImage
              tiles={this.state.tiles}
              palette={this.props.palette}
            />
          ) : null }
        </button>
        {this.props.title ? (
          <span
            className="gallery-image__title"
          >
            {this.props.title}
          </span>
        ) : null}
        <span
          className="gallery-image__created"
        >
          {dayjs(this.props.created, dateFormat).format(dateFormatReadable)}
        </span>
        <GalleryImageButtons hash={this.props.hash} buttons={['select', 'download', 'delete', 'edit']} />
      </li>
    );
  }
}

GalleryImage.propTypes = {
  created: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  hashes: PropTypes.object,
  palette: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  setLightboxImageIndex: PropTypes.func.isRequired,
};

GalleryImage.defaultProps = {
  hashes: null,
};

export default GalleryImage;
