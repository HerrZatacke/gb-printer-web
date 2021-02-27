import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SVG from '../SVG';

dayjs.extend(customParseFormat);

const PluginSelect = ({ toPlugins, plugins }) => (
  <span className="plugin-select">
    <button
      type="button"
      className="gallery-image-buttons__button"
      onClick={toPlugins}
    >
      <SVG name="plug" />
    </button>
    <ul
      className="plugin-select__plugin-list"
    >
      {
        plugins.map(({ url }) => (
          <li
            className="plugin-select__plugin-list-entry"
            key={url}
          >
            <button
              type="button"
              className="plugin-select__button"
            >
              {url}
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
