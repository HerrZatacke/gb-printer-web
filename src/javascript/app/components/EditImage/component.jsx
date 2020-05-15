import React from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';
import PaletteSelect from '../PaletteSelect';
import Buttons from '../Buttons/component';

const EditImage = (props) => (
  (props.imageData) ? (
    <div className="edit-image">
      <div className="edit-image__backdrop" />
      <div
        className="edit-image__box"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${props.palette.palette[0]} 500px, #ffffff 600px)`,
        }}
      >
        <label
          className="edit-image__header"
          style={{

            color: props.palette.palette[3],
          }}
        >
          <input
            className="edit-image__header-edit"
            value={props.title}
            onChange={(ev) => {
              props.updateTitle(ev.target.value);
            }}
          />
        </label>
        <GameBoyImage
          tiles={props.imageData}
          palette={props.palette.palette || ['#ffffff', '#dddddd', '#bbbbbb', '#999999']}
        />
        <PaletteSelect value={props.palette.shortName} onChange={props.updatePalette} />
        <Buttons
          confirm={props.save}
          deny={props.cancel}
        />
      </div>
    </div>
  ) : null
);

EditImage.propTypes = {
  cancel: PropTypes.func.isRequired,
  imageData: PropTypes.array,
  palette: PropTypes.object,
  save: PropTypes.func.isRequired,
  title: PropTypes.string,
  updatePalette: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
};

EditImage.defaultProps = {
  title: null,
  imageData: null,
  palette: [],
};

export default EditImage;
