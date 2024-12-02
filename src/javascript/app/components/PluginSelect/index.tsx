import React from 'react';
import classnames from 'classnames';
import SVG from '../SVG';
import './index.scss';
import useFiltersStore from '../../stores/filtersStore';
import useItemsStore from '../../stores/itemsStore';
import { usePluginsContext } from '../../contexts/plugins';

interface Props {
  children: React.ReactNode,
  pluginsActive: boolean,
  hash?: string,
}

function PluginSelect({ children, pluginsActive, hash }: Props) {
  const { plugins } = useItemsStore();
  const { imageSelection } = useFiltersStore();
  const { runWithImage, runWithImages } = usePluginsContext();

  const dispatchToPlugin = (url: string) => {
    if (hash) {
      runWithImage(url, hash);
    } else {
      runWithImages(url, imageSelection);
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
