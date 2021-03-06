import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';

const PaletteSelect = (props) => {

  const [initiallySelected, setInitiallySelected] = useState(props.value);

  const palettes = [...props.palettes];

  // this option is used for assigning a single palette to an animation
  if (props.allowEmpty) {
    palettes.unshift({
      shortName: '',
      name: 'As selected per image',
      palette: [],
    });
  }

  return (
    <>
      <select
        className="palette-select"
        value={props.value}
        onChange={(ev) => {
          props.onChange(ev.target.value, true);
          setInitiallySelected(ev.target.value);
        }}
      >
        {
          palettes.map(({ shortName, name }) => (
            <option
              key={shortName}
              value={shortName}
            >
              { name }
            </option>
          ))
        }
      </select>
      <label
        className={
          classnames('palette-select__check-label', {
            'palette-select__check-label--checked': props.invertPalette,
          })
        }
      >
        <input
          type="checkbox"
          className="palette-select__checkbox"
          checked={props.invertPalette}
          onChange={({ target }) => {
            props.updateInvertPalette(target.checked);
          }}
        />
        <SVG name="checkmark" />
        <span className="palette-select__check-label-text">
          Invert Palette
        </span>
      </label>
      { props.noFancy ? null : (
        <ul className="fancy-palette-select">
          {
            palettes.map(({ shortName, name, palette }) => (
              <li
                key={shortName}
                className={
                  classnames('fancy-palette-select__entry', {
                    'fancy-palette-select__entry--active': initiallySelected === shortName,
                  })
                }
              >
                <button
                  type="button"
                  className="fancy-palette-select__button"
                  title={name}
                  onClick={() => {
                    props.onChange(shortName, true);
                    setInitiallySelected(shortName);
                  }}
                  onMouseEnter={() => {
                    props.onChange(shortName, false);
                  }}
                  onMouseLeave={() => {
                    props.onChange(initiallySelected);
                  }}
                >
                  <span className="fancy-palette-select__color" style={{ backgroundColor: palette[0] }} />
                  <span className="fancy-palette-select__color" style={{ backgroundColor: palette[1] }} />
                  <span className="fancy-palette-select__color" style={{ backgroundColor: palette[2] }} />
                  <span className="fancy-palette-select__color" style={{ backgroundColor: palette[3] }} />
                </button>
              </li>
            ))
          }
        </ul>
      )}
    </>
  );
};

PaletteSelect.propTypes = {
  palettes: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  invertPalette: PropTypes.bool.isRequired,
  updateInvertPalette: PropTypes.func.isRequired,
  noFancy: PropTypes.bool,
  allowEmpty: PropTypes.bool,
};

PaletteSelect.defaultProps = {
  noFancy: false,
  allowEmpty: false,
};

export default PaletteSelect;
