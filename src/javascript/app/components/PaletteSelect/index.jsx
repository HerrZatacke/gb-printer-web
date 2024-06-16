import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import SVG from '../SVG';
import './index.scss';
import usePaletteSort from '../../../hooks/usePaletteSort';

const PaletteSelect = ({
  value,
  allowEmpty,
  onChange,
  invertPalette,
  updateInvertPalette,
  noFancy,
  selectLabel,
}) => {
  const [initiallySelected, setInitiallySelected] = useState(value);

  const palettesUnsorted = [...useSelector((state) => (state.palettes))];

  const { sortFn } = usePaletteSort();

  const palettes = palettesUnsorted.toSorted(sortFn);

  // this option is used for assigning a single palette to an animation
  if (allowEmpty) {
    palettes.unshift({
      shortName: '',
      name: 'As selected per image',
      palette: [],
    });
  }

  return (
    <>
      {(
        selectLabel ? (
          <label
            className="palette-select__select-label"
            htmlFor="palette-select-select"
          >
            { selectLabel }
          </label>
        ) : null
      )}
      <select
        id="palette-select-select"
        className="palette-select"
        value={value}
        onChange={(ev) => {
          onChange(ev.target.value, true);
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
      {
        updateInvertPalette ? (
          <label
            className={
              classnames('palette-select__check-label', {
                'palette-select__check-label--checked': invertPalette,
              })
            }
          >
            <input
              type="checkbox"
              className="palette-select__checkbox"
              checked={invertPalette}
              onChange={({ target }) => {
                updateInvertPalette(target.checked);
              }}
            />
            <SVG name="checkmark" />
            <span className="palette-select__check-label-text">
              Invert Palette
            </span>
          </label>
        ) : null
      }
      { noFancy ? null : (
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
                    onChange(shortName, true);
                    setInitiallySelected(shortName);
                  }}
                  onMouseEnter={() => {
                    onChange(shortName, false);
                  }}
                  onMouseLeave={() => {
                    onChange(initiallySelected);
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
  value: PropTypes.string.isRequired,
  selectLabel: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  invertPalette: PropTypes.bool,
  updateInvertPalette: PropTypes.func,
  noFancy: PropTypes.bool,
  allowEmpty: PropTypes.bool,
};

PaletteSelect.defaultProps = {
  selectLabel: null,
  noFancy: false,
  allowEmpty: false,
  invertPalette: false,
  updateInvertPalette: null,
};

export default PaletteSelect;
