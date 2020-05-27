import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import classnames from 'classnames';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import GameBoyImage from '../GameBoyImage';
import GalleryImageButtons from '../GalleryImageButtons';
import RGBNSelect from '../RGBNSelect';
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

    this.handleCellClick = this.handleCellClick.bind(this);
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

  handleCellClick(ev) {
    if (ev.ctrlKey) {
      this.props.updateImageToSelection(this.props.isSelected ? 'remove' : 'add');
    } else {
      this.props.setLightboxImageIndex();
    }
  }

  renderDefault() {
    return (
      <li
        className={
          classnames('gallery-image', {
            'gallery-image--selected': this.props.isSelected,
          })
        }
        onClick={this.handleCellClick}
        role="presentation"
      >
        <div className="gallery-image__image">
          { this.state.tiles ? (
            <GameBoyImage
              tiles={this.state.tiles}
              palette={this.props.palette}
            />
          ) : null }
        </div>
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

  renderList() {
    return (
      <tr
        className={
          classnames('gallery-list-image', {
            'gallery-list-image--selected': this.props.isSelected,
          })
        }
        onClick={this.handleCellClick}
        role="presentation"
      >
        <td className="gallery-list-image__cell-image">
          <div className="gallery-list-image__image">
            { this.state.tiles ? (
              <GameBoyImage
                tiles={this.state.tiles}
                palette={this.props.palette}
              />
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
          <GalleryImageButtons hash={this.props.hash} buttons={['select', 'download', 'delete', 'edit']} />
        </td>
      </tr>
    );
  }

  render() {
    return this.props.type === 'default' ? this.renderDefault() : this.renderList();
  }
}

GalleryImage.propTypes = {
  created: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  hashes: PropTypes.object,
  palette: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  setLightboxImageIndex: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['list', 'default']).isRequired,
  index: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  updateImageToSelection: PropTypes.func.isRequired,
};

GalleryImage.defaultProps = {
  hashes: null,
};

export default GalleryImage;
