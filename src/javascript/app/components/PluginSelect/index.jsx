import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import SVG from '../SVG';
import './index.scss';
import { PLUGIN_IMAGE, PLUGIN_IMAGES } from '../../store/actions';

const PluginSelect = ({ children, pluginsActive, hash }) => {
  const plugins = useSelector((state) => state.plugins);
  const dispatch = useDispatch();

  const toPlugins = (url) => {
    if (hash) {
      dispatch({
        type: PLUGIN_IMAGE,
        payload: {
          url,
          hash,
        },
      });
    } else {
      dispatch({
        type: PLUGIN_IMAGES,
        payload: {
          url,
        },
      });
    }
  };

  return (
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
};

PluginSelect.propTypes = {
  children: PropTypes.node.isRequired,
  pluginsActive: PropTypes.bool.isRequired,
  hash: PropTypes.string,
};

PluginSelect.defaultProps = {
  hash: null,
};

export default PluginSelect;
