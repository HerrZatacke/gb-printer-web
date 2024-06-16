import React, { useState } from 'react';
import classnames from 'classnames';
import Palette from '../Palette';
import SVG from '../SVG';
import { Palette as PaletteT } from '../../../../types/Palette';

import './index.scss';
import { usePalettes } from './usePalettes';
import usePaletteFromFile from '../../../hooks/usePaletteFromFile';

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

const Palettes = () => {
  const { onInputChange, busy } = usePaletteFromFile();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const { filter, headline: currentHeadline, id } = tabs[selectedTabIndex || 0];

  const {
    palettes,
    newPalette,
  } = usePalettes();

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
      <ul className="palettes">
        {
          palettes.filter(filter).map((palette) => (
            <Palette
              key={palette.shortName}
              name={palette.name}
              isPredefined={palette.isPredefined || false}
              shortName={palette.shortName}
              palette={palette.palette}
            />
          ))
        }
      </ul>
    </>
  );
};

export default Palettes;
