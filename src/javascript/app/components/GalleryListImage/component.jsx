import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import GameBoyImage from '../GameBoyImage';
import GalleryImageButtons from '../GalleryImageButtons';
import RGBNSelect from '../RGBNSelect';
import { dateFormat, dateFormatReadable } from '../../../tools/values';
import { load } from '../../../tools/storage';
import RGBNDecoder from '../../../tools/RGBNDecoder';

dayjs.extend(customParseFormat);

class GalleryListImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tiles: null,
      isRGBN: !!this.props.hashes,
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
          this.setState({ tiles });
        });
    }
  }

  render() {
    return (
      <tr className="gallery-list-image">
        <td className="gallery-list-image__cell-image">
          <div className="gallery-list-image__image">
            { this.state.tiles ? (
              <GameBoyImage tiles={this.state.tiles} palette={this.props.palette} isRGBN={!!this.state.isRGBN} />
            ) : null }
          </div>
        </td>

        <td className="gallery-list-image__cell-index">
          <div className="gallery-list-image__index">
            {this.props.index}
          </div>
        </td>

        <td className="gallery-list-image__cell-description">
          <div className="gallery-list-image__description">
            <span className="gallery-list-image__title">
              {this.props.title}
            </span>
            <span className="gallery-list-image__created">
              {dayjs(this.props.created, dateFormat).format(dateFormatReadable)}
            </span>
          </div>
        </td>

        <td className="gallery-list-image__cell-rgbn">
          { this.props.hashes ? null : (
            <RGBNSelect hash={this.props.hash} />
          )}
        </td>

        <td className="gallery-list-image__cell-buttons">
          <GalleryImageButtons hash={this.props.hash} buttons={this.state.isRGBN ? ['delete'] : ['download', 'delete', 'edit']} />
        </td>
      </tr>
    );
  }
}

GalleryListImage.propTypes = {
  created: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  hashes: PropTypes.object,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  title: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

GalleryListImage.defaultProps = {
  hashes: null,
};

export default GalleryListImage;
