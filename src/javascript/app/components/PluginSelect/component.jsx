import React from 'react';
import PropTypes from 'prop-types';
import SVG from '../SVG';

const PluginSelect = ({ toPlugins, plugins, children }) => (
  <span className="plugin-select__wrapper">
    {children}
    <ul className="plugin-select">
      {
        plugins.map(({ url, name, description, loading, error }) => (
          <li
            className="plugin-select__plugin-list-entry"
            key={url}
          >
            <button
              type="button"
              className="plugin-select__button"
              disabled={Boolean(loading || error)}
              title={`${error || description || ''}\n${url}`}
              onClick={() => toPlugins(url)}
            >
              {error && (
                <SVG name="warn" />
              )}
              {loading && (
                <SVG name="loading" />
              )}
              {name || url}
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
