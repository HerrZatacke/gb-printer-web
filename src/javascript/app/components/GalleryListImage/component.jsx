import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { dateFormat, dateFormatReadable } from '../../../tools/values';
import GameBoyImage from '../GameBoyImage';
import { load } from '../../../tools/storage';
import GalleryImageButtons from '../GalleryImageButtons';

dayjs.extend(customParseFormat);

class GalleryListImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tiles: null,
    };
  }

  componentDidMount() {
    load(this.props.hash)
      .then((tiles) => {
        this.setState({ tiles });
      });
  }

  render() {
    return (
      <tr className="gallery-list-image">
        <td className="gallery-list-image__image">
          { this.state.tiles ? (
            <GameBoyImage tiles={this.state.tiles} palette={this.props.palette} />
          ) : null }
        </td>

        <td className="gallery-list-image__description">
          <span className="gallery-list-image__title">
            {this.props.title}
          </span>
          <span className="gallery-list-image__created">
            {dayjs(this.props.created, dateFormat).format(dateFormatReadable)}
          </span>
        </td>

        <td className="gallery-list-image__checkboxes">
          <input
            className="gallery-list-image__checkbox gallery-list-image__checkbox--red"
            checked={this.props.isR}
            onChange={(ev) => {
              this.props.updateRGBN('r', ev.target.checked);
            }}
            type="checkbox"
          />
          <input
            className="gallery-list-image__checkbox gallery-list-image__checkbox--green"
            checked={this.props.isG}
            onChange={(ev) => {
              this.props.updateRGBN('g', ev.target.checked);
            }}
            type="checkbox"
          />
          <input
            className="gallery-list-image__checkbox gallery-list-image__checkbox--blue"
            checked={this.props.isB}
            onChange={(ev) => {
              this.props.updateRGBN('b', ev.target.checked);
            }}
            type="checkbox"
          />
          <input
            className="gallery-list-image__checkbox gallery-list-image__checkbox--normal"
            checked={this.props.isN}
            onChange={(ev) => {
              this.props.updateRGBN('n', ev.target.checked);
            }}
            type="checkbox"
          />
        </td>

        <td>
          <GalleryImageButtons hash={this.props.hash} />
        </td>
      </tr>
    );
  }
}

GalleryListImage.propTypes = {
  created: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  isR: PropTypes.bool.isRequired,
  isG: PropTypes.bool.isRequired,
  isB: PropTypes.bool.isRequired,
  isN: PropTypes.bool.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  title: PropTypes.string.isRequired,
  updateRGBN: PropTypes.func.isRequired,
};

GalleryListImage.defaultProps = {
};

export default GalleryListImage;
