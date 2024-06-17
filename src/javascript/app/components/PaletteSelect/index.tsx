import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import SVG from '../SVG';
import './index.scss';
import type { State } from '../../store/State';
import usePaletteSort from '../../../hooks/usePaletteSort';

interface Props {
  value: string,
  selectLabel?: string,
  invertPalette?: boolean,
  noFancy?: boolean,
  allowEmpty?: boolean,
  // `confirm` param is required for direct preview of hovered palettes in edit form
  onChange: (value: string, confirm?: boolean) => void,
  updateInvertPalette?: (invert: boolean) => void,
}

function PaletteSelect({
  value,
  allowEmpty,
  invertPalette,
  noFancy,
  selectLabel,
  onChange,
  updateInvertPalette,
}: Props) {
  const [initiallySelected, setInitiallySelected] = useState<string>(value);

  const palettesUnsorted = useSelector((state: State) => (state.palettes));

  const { sortFn } = usePaletteSort();

  const palettes = [...palettesUnsorted].sort(sortFn);

  // this option is used for assigning a single palette to an animation
  if (allowEmpty) {
    palettes.unshift({
      shortName: '',
      name: 'As selected per image',
      palette: [],
      isPredefined: false,
      origin: '',
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
}

export default PaletteSelect;
