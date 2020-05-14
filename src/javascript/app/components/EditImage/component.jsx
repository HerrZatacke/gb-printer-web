import React from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';
import PaletteSelect from '../PaletteSelect';

const EditImage = (props) => (
  (props.imageData) ? (
    <div className="edit-image">
      <div className="edit-image__backdrop" />
      <div
        className="edit-image__box"
        style={{
          backgroundColor: props.palette.palette[0],
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
        <GameBoyImage tiles={props.imageData} palette={props.palette.palette || ['#ffffff', '#dddddd', '#bbbbbb', '#999999']} />
        <PaletteSelect value={props.palette.shortName} onChange={props.updatePalette} />
      </div>
    </div>
  ) : null
);

EditImage.propTypes = {
  title: PropTypes.string,
  imageData: PropTypes.array,
  palette: PropTypes.object,
  updateTitle: PropTypes.func.isRequired,
  updatePalette: PropTypes.func.isRequired,
};

EditImage.defaultProps = {
  title: null,
  imageData: null,
  palette: [],
};

export default EditImage;
