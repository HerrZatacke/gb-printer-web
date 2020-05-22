import React from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';
import PaletteSelect from '../PaletteSelect';
import Buttons from '../Buttons/component';
import { load } from '../../../tools/storage';
import RGBNDecoder from '../../../tools/RGBNDecoder';

class EditImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tiles: null,
      isRGBN: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hash !== this.props.hash && this.props.hash) {

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
  }

  render() {
    return (
      (this.props.hash && this.state.tiles) ? (
        <div className="edit-image">
          <div className="edit-image__backdrop" />
          <div
            className="edit-image__box"
            style={{
              backgroundImage: `linear-gradient(to bottom, ${this.props.palette.palette[0]} 500px, #ffffff 600px)`,
            }}
          >
            <label
              className="edit-image__header"
              style={{
                color: this.props.palette.palette[3],
              }}
            >
              <input
                className="edit-image__header-edit"
                placeholder="Add a title"
                value={this.props.title}
                onChange={(ev) => {
                  this.props.updateTitle(ev.target.value);
                }}
              />
            </label>
            <GameBoyImage
              tiles={this.state.tiles}
              palette={this.props.palette.palette || ['#ffffff', '#dddddd', '#bbbbbb', '#999999']}
              isRGBN={this.state.isRGBN}
            />
            { this.state.isRGBN ? null : (
              <PaletteSelect
                value={this.props.palette.shortName}
                onChange={this.props.updatePalette}
              />
            ) }
            <Buttons
              confirm={this.props.save}
              deny={this.props.cancel}
            />
          </div>
        </div>
      ) : null
    );
  }
}

EditImage.propTypes = {
  cancel: PropTypes.func.isRequired,
  hash: PropTypes.string,
  hashes: PropTypes.object,
  palette: PropTypes.object,
  save: PropTypes.func.isRequired,
  title: PropTypes.string,
  updatePalette: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
};

EditImage.defaultProps = {
  title: null,
  hash: null,
  hashes: null,
  palette: [],
};

export default EditImage;
