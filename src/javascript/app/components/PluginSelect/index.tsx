import React from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import SVG from '../SVG';
import './index.scss';
import { Actions } from '../../store/actions';
import type { PluginImageBatchAction, PluginImageSingleAction } from '../../../../types/actions/PluginActions';
import useItemsStore from '../../stores/itemsStore';

interface Props {
  children: React.ReactNode,
  pluginsActive: boolean,
  hash?: string,
}

function PluginSelect({ children, pluginsActive, hash }: Props) {
  const { plugins } = useItemsStore();
  const dispatch = useDispatch();

  const dispatchToPlugin = (url: string) => {
    if (hash) {
      dispatch<PluginImageSingleAction>({
        type: Actions.PLUGIN_IMAGE,
        payload: {
          url,
          hash,
        },
      });
    } else {
      dispatch<PluginImageBatchAction>({
        type: Actions.PLUGIN_IMAGES,
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
}

export default PluginSelect;
