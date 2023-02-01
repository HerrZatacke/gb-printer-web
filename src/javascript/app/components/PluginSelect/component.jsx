import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import SVG from '../SVG';

const PluginSelect = ({
  toPlugins,
  plugins,
  children,
  pluginsActive,
}) => (
  <span className="plugin-select__wrapper">
    {children}
    <ul className={classnames('plugin-select', { 'plugin-select--active': pluginsActive })}>
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
  pluginsActive: PropTypes.bool.isRequired,
};

export default PluginSelect;
