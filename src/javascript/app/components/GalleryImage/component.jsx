import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { dateFormat, dateFormatReadable } from '../../../tools/values';
import GameBoyImage from '../GameBoyImage';
import { load } from '../../../tools/storage';
import GalleryImageButtons from '../GalleryImageButtons';
import RGBNDecoder from '../../../tools/RGBNDecoder';

dayjs.extend(customParseFormat);

class GalleryImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tiles: null,
      isRGBN: null,
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
            isRGBN: true,
          });
        });
    } else {
      load(this.props.hash)
        .then((tiles) => {
          this.setState({
            tiles,
            isRGBN: false,
          });
        });
    }
  }

  render() {
    return (
      <li className="gallery-image">
        <span className="gallery-image__image">
          { this.state.tiles ? (
            <GameBoyImage
              tiles={this.state.tiles}
              palette={this.props.palette}
              isRGBN={this.state.isRGBN}
            />
          ) : null }
        </span>
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
        <GalleryImageButtons hash={this.props.hash} buttons={this.state.isRGBN ? ['delete', 'download'] : ['download', 'delete', 'edit']} />
      </li>
    );
  }
}

GalleryImage.propTypes = {
  created: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  hashes: PropTypes.object,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  title: PropTypes.string.isRequired,
};

GalleryImage.defaultProps = {
  hashes: null,
};

export default GalleryImage;
