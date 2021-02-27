import React from 'react';
import PropTypes from 'prop-types';
import SVG from '../SVG';

const PluginSelect = ({ toPlugins, plugins }) => (
  <span className="plugin-select">
    <button
      type="button"
      className="gallery-image-buttons__button"
    >
      <SVG name="plug" />
    </button>
    <ul
      className="plugin-select__plugin-list"
    >
      {
        plugins.map(({ url, name, description }) => (
          <li
            className="plugin-select__plugin-list-entry"
            key={url}
          >
            <button
              type="button"
              className="plugin-select__button"
              title={description}
              onClick={() => toPlugins(url)}
            >
              {name}
              <small>
                {url}
              </small>
            </button>
          </li>
        ))
      }
    </ul>
  </span>
);

PluginSelect.propTypes = {
  toPlugins: PropTypes.func.isRequired,
  plugins: PropTypes.array.isRequired,
};

export default PluginSelect;
