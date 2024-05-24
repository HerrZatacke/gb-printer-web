import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import SVG from '../SVG';
import './index.scss';
import { Actions } from '../../store/actions';
import { State } from '../../store/State';
import { PluginImageBatchAction, PluginImageSingleAction } from '../../store/middlewares/plugins';

interface Props {
  children: React.ReactNode,
  pluginsActive: boolean,
  hash?: string,
}

const PluginSelect = ({ children, pluginsActive, hash }: Props) => {
  const plugins = useSelector((state: State) => state.plugins);
  const dispatch = useDispatch();

  const dispatchToPlugin = (url: string) => {
    if (hash) {
      dispatch({
        type: Actions.PLUGIN_IMAGE,
        payload: {
          url,
          hash,
        },
      } as PluginImageSingleAction);
    } else {
      dispatch({
        type: Actions.PLUGIN_IMAGES,
        payload: {
          url,
        },
      } as PluginImageBatchAction);
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
                onClick={() => dispatchToPlugin(url)}
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

export default PluginSelect;
