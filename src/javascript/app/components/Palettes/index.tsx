import React, { useState } from 'react';
import classnames from 'classnames';
import Palette from '../Palette';
import SVG from '../SVG';
import type { Palette as PaletteT } from '../../../../types/Palette';

import './index.scss';
import { usePalettes } from './usePalettes';
import usePaletteFromFile from '../../../hooks/usePaletteFromFile';
import usePaletteSort from '../../../hooks/usePaletteSort';
import type { PaletteSortMode } from '../../../consts/paletteSortModes';

interface Tab {
  id: string,
  headline: string,
  filter: (palette: PaletteT) => boolean,
}

const tabs: Tab[] = [
  {
    id: 'own',
    headline: 'Own palettes',
    filter: ({ isPredefined }) => !isPredefined,
  },
  {
    id: 'predefined',
    headline: 'Predefined palettes',
    filter: ({ isPredefined }) => isPredefined,
  },
  {
    id: 'all',
    headline: 'All palettes',
    filter: Boolean,
  },
];

function Palettes() {
  const { onInputChange, busy } = usePaletteFromFile();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const { filter, headline: currentHeadline, id } = tabs[selectedTabIndex || 0];

  const {
    palettes: palettesUnsorted,
    newPalette,
  } = usePalettes();

  const {
    sortFn,
    sortPalettes,
    setSortPalettes,
    paletteSortOptions,
    paletteUsages,
  } = usePaletteSort();

  const palettes = [...palettesUnsorted].sort(sortFn);

  return (
    <>
      <ul
        className="contenttabs__tabs"
      >
        {
          tabs
            .map((tab, index) => (
              <li
                className="contenttabs__tab"
                key={tab.id}
              >
                <button
                  type="button"
                  className={
                    classnames('button contenttabs__tabs-button', {
                      'button contenttabs__tabs-button--active': index === selectedTabIndex,
                    })
                  }
                  onClick={() => setSelectedTabIndex(index)}
                >
                  {tab.headline}
                </button>
              </li>
            ))
        }
      </ul>
      <h2 className="palettes__headline">
        {currentHeadline}
        { id === 'own' ? (
          <>
            <button
              type="button"
              disabled={busy}
              title="New palette"
              className="button palettes__add-button"
              onClick={() => {
                newPalette();
              }}
            >
              <SVG name="add" />
            </button>
            <label
              title="New palette from file"
              className={classnames('button palettes__add-button', {
                'button--disabled': busy,
              })}
            >
              <SVG name="file-add" />
              <input
                disabled={busy}
                type="file"
                hidden
                onChange={onInputChange}
              />
            </label>
          </>
        ) : null}
      </h2>

      <div className="inputgroup">
        <label htmlFor="settings-sort-palettes" className="inputgroup__label">
          Sort Palettes
        </label>
        <select
          id="settings-sort-palettes"
          className="inputgroup__input inputgroup__input--select"
          value={sortPalettes}
          onChange={(ev) => {
            setSortPalettes(ev.target.value as PaletteSortMode);
          }}
        >
          {
            paletteSortOptions.map(({ label, value }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))
          }
        </select>
      </div>

      <ul className="palettes">
        {
          palettes.filter(filter).map((palette) => (
            <Palette
              key={palette.shortName}
              name={palette.name}
              isPredefined={palette.isPredefined || false}
              shortName={palette.shortName}
              palette={palette.palette}
              usage={paletteUsages[palette.shortName] || 0}
            />
          ))
        }
      </ul>
    </>
  );
}

export default Palettes;
