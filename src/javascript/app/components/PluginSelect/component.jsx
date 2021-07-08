import React from 'react';
import PropTypes from 'prop-types';

const PluginSelect = ({ toPlugins, plugins, children }) => (
  <span className="plugin-select__wrapper">
    {children}
    <ul className="plugin-select">
      {
        plugins.map(({ url, name, description }) => (
          <li
            className="plugin-select__plugin-list-entry"
            key={url}
          >
            <button
              type="button"
              className="plugin-select__button"
              title={`${description}\n${url}`}
              onClick={() => toPlugins(url)}
            >
              {name}
            </button>
          </li>
        ))
      }
    </ul>
  </span>
);

PluginSelect.propTypes = {
  children: PropTypes.node.isRequired,
  toPlugins: PropTypes.func.isRequired,
  plugins: PropTypes.array.isRequired,
};

export default PluginSelect;
