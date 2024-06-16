import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Palette from '../Palette';
import SVG from '../SVG';
import usePaletteFromFile from '../../../hooks/usePaletteFromFile';

const tabs = {
  all: {
    headline: 'All palettes',
    filter: Boolean,
  },
  own: {
    headline: 'Own palettes',
    filter: ({ isPredefined }) => !isPredefined,
  },
  predefined: {
    headline: 'Predefined palettes',
    filter: ({ isPredefined }) => isPredefined,
  },
};

const Palettes = (props) => {
  const { onInputChange } = usePaletteFromFile();
  const [selectedTab, setSelectedTab] = useState(Object.keys(tabs)[0]);
  const { filter, headline: currentHeadline } = tabs[selectedTab];

  return (
    <>
      <ul
        className="contenttabs__tabs"
      >
        {
          Object.keys(tabs)
            .map((tabId) => {
              const { headline } = tabs[tabId];
              return (
                <li
                  className="contenttabs__tab"
                  key={tabId}
                >
                  <button
                    type="button"
                    className={
                      classnames('button contenttabs__tabs-button', {
                        'button contenttabs__tabs-button--active': tabId === selectedTab,
                      })
                    }
                    onClick={() => setSelectedTab(tabId)}
                  >
                    {headline}
                  </button>
                </li>
              );
            })
        }
      </ul>
      <h2 className="palettes__headline">
        {currentHeadline}
        { selectedTab === 'own' ? (
          <>
            <button
              type="button"
              title="New palette"
              className="button palettes__add-button"
              onClick={() => {
                props.newPalette();
              }}
            >
              <SVG name="add" />
            </button>
            <label
              title="New palette from file"
              className="button palettes__add-button"
            >
              <SVG name="file-add" />
              <input
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
          props.palettes.filter(filter).map((palette) => (
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

Palettes.propTypes = {
  palettes: PropTypes.array.isRequired,
  newPalette: PropTypes.func.isRequired,
};

Palettes.defaultProps = {
};

export default Palettes;
