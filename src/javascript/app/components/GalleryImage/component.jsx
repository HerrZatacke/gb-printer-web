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
        load(this.props.hashes.r, this.props.frames.r),
        load(this.props.hashes.g, this.props.frames.g),
        load(this.props.hashes.b, this.props.frames.b),
        load(this.props.hashes.n, this.props.frames.n),
      ])
        .then((tiles) => {
          this.setState({
            tiles: RGBNDecoder.rgbnTiles(tiles),
          });
        });
    } else {
      load(this.props.hash, this.props.frame)
        .then((tiles) => {
          this.setState({
            tiles,
          });
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.frame !== this.props.frame) ||
      (JSON.stringify(prevProps.frames) !== JSON.stringify(this.props.frames))
    ) {
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
            });
          });
      } else {
        load(this.props.hash, this.props.frame)
          .then((tiles) => {
            this.setState({
              tiles,
            });
          });
      }
    }
  }

  getDateSpan(className) {
    if (this.props.hideDate || !this.props.created) {
      return null;
    }

    return (
      <span className={className}>
        { dayjs(this.props.created, dateFormat).format(dateFormatReadable) }
      </span>
    );
  }

  handleCellClick(ev) {
    if (ev.ctrlKey || ev.shiftKey) {
      ev.preventDefault();
      this.props.updateImageSelection(this.props.isSelected ? 'remove' : 'add', ev.shiftKey, this.props.page);
    } else {
      this.props.editImage();
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
              lockFrame={this.props.lockFrame}
              invertPalette={this.props.invertPalette}
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
        <ul className="gallery-image__tags">
          {this.props.tags.map((tag) => (
            <li
              key={tag}
              title={tag}
              className="gallery-image__tag"
            >
              {tag}
            </li>
          ))}
        </ul>
        {this.getDateSpan('gallery-image__created')}
        <GalleryImageButtons hash={this.props.hash} buttons={['select', 'download', 'delete', 'view', 'share', 'plugins']} />
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
              <div className="gallery-list-image__image--scale">
                <GameBoyImage
                  lockFrame={this.props.lockFrame}
                  invertPalette={this.props.invertPalette}
                  tiles={this.state.tiles}
                  palette={this.props.palette}
                />
              </div>
            ) : null }
          </div>
        </td>

        <td className="gallery-list-image__cell-description">
          <div className="gallery-list-image__description">
            <span className="gallery-list-image__title">
              {this.props.title}
            </span>
            {this.getDateSpan('gallery-list-image__created')}
          </div>
        </td>

        <td className="gallery-list-image__cell-rgbn">
          { this.props.hashes ? null : (
            <RGBNSelect hash={this.props.hash} />
          )}
        </td>

        <td className="gallery-list-image__cell-buttons">
          <GalleryImageButtons hash={this.props.hash} buttons={['select', 'download', 'delete', 'view', 'plugins']} />
        </td>
      </tr>
    );
  }

  render() {
    return this.props.type === 'default' ? this.renderDefault() : this.renderList();
  }
}

GalleryImage.propTypes = {
  created: PropTypes.string,
  hash: PropTypes.string.isRequired,
  hashes: PropTypes.object,
  palette: PropTypes.object.isRequired,
  invertPalette: PropTypes.bool.isRequired,
  frame: PropTypes.string,
  frames: PropTypes.object,
  lockFrame: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  editImage: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['list', 'default']).isRequired,
  isSelected: PropTypes.bool.isRequired,
  updateImageSelection: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  hideDate: PropTypes.bool.isRequired,
};

GalleryImage.defaultProps = {
  created: null,
  hashes: null,
  frame: null,
  frames: null,
};

export default GalleryImage;
