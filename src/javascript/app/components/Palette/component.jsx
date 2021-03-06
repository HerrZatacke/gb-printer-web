import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';

const GRADIENT_OPACITY = '36';

const Component = (props) => (
  <li
    className={
      classnames('palette', {
        'palette--active': props.isActive,
      })
    }
    style={{
      backgroundImage: `linear-gradient(to right, ${props.palette[0]}${GRADIENT_OPACITY} 0%, ${props.palette[1]}${GRADIENT_OPACITY} 33.3%, ${props.palette[2]}${GRADIENT_OPACITY} 66.6%, ${props.palette[3]}${GRADIENT_OPACITY} 100%)`,
    }}
  >
    <button
      onClick={() => {
        props.setActive();
      }}
      className="palette__button"
      type="button"
    >
      <div className="palette__name">
        {props.name}
        <span className="palette__shortname">{props.shortName}</span>
      </div>
      <div className="palette__colors">
        <div className="palette__color" style={{ backgroundColor: props.palette[0] }} title={props.palette[0]}> </div>
        <div className="palette__color" style={{ backgroundColor: props.palette[1] }} title={props.palette[1]}> </div>
        <div className="palette__color" style={{ backgroundColor: props.palette[2] }} title={props.palette[2]}> </div>
        <div className="palette__color" style={{ backgroundColor: props.palette[3] }} title={props.palette[3]}> </div>
      </div>
    </button>
    {
      props.isPredefined ? null : (
        <div className="palette__manage-buttons">
          <button
            type="button"
            className="palette__manage-button palette__manage-button--edit"
            onClick={() => props.editPalette()}
          >
            <SVG name="edit" />
          </button>
          <button
            type="button"
            className="palette__manage-button palette__manage-button--delete"
            onClick={() => props.deletePalette()}
          >
            <SVG name="delete" />
          </button>
        </div>
      )
    }
  </li>
);

Component.propTypes = {
  shortName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isPredefined: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
  deletePalette: PropTypes.func.isRequired,
  editPalette: PropTypes.func.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Component.defaultProps = {};

export default Component;
