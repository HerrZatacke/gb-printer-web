import React from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';
import PaletteSelect from '../PaletteSelect';
import Buttons from '../Buttons';
import GreySelect from '../GreySelect';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import { load } from '../../../tools/storage';

class EditImage extends React.Component {
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

    const paletteColors = this.props.palette ? this.props.palette.palette : null;

    return (
      (this.state.loaded) ? (
        <div className="edit-image">
          <div className="edit-image__backdrop" />
          <div
            className="edit-image__box"
            style={{
              backgroundImage: paletteColors ? `linear-gradient(to bottom, ${paletteColors[0]} 500px, #ffffff 600px)` : null,
            }}
          >
            <label
              className="edit-image__header"
              style={{
                color: paletteColors ? paletteColors[3] : null,
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
              palette={this.props.palette}
            />
            { this.props.hashes ? (
              <GreySelect
                values={this.props.palette}
                onChange={this.props.updatePalette}
              />
            ) : (
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
  frame: PropTypes.string,
  frames: PropTypes.object,
  save: PropTypes.func.isRequired,
  title: PropTypes.string,
  updatePalette: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
};

EditImage.defaultProps = {
  title: null,
  hash: null,
  hashes: null,
  palette: null,
  frame: null,
  frames: null,
};

export default EditImage;
