import React from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';
import PaletteSelect from '../PaletteSelect';
import Buttons from '../Buttons/component';
import { load } from '../../../tools/storage';

class EditImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tiles: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.imageHash !== this.props.imageHash && this.props.imageHash) {
      load(this.props.imageHash)
        .then((tiles) => {
          this.setState({
            tiles,
          });
        });
    }
  }

  render() {
    return (
      (this.props.imageHash && this.state.tiles) ? (
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
                value={this.props.title}
                onChange={(ev) => {
                  this.props.updateTitle(ev.target.value);
                }}
              />
            </label>
            <GameBoyImage
              tiles={this.state.tiles}
              palette={this.props.palette.palette || ['#ffffff', '#dddddd', '#bbbbbb', '#999999']}
            />
            <PaletteSelect value={this.props.palette.shortName} onChange={this.props.updatePalette} />
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
  imageHash: PropTypes.string,
  palette: PropTypes.object,
  save: PropTypes.func.isRequired,
  title: PropTypes.string,
  updatePalette: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
};

EditImage.defaultProps = {
  title: null,
  imageHash: null,
  palette: [],
};

export default EditImage;
