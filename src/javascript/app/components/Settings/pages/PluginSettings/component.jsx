import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SVG from '../../../SVG';

const PluginSettings = ({ pluginAdd, pluginRemove, plugins }) => {

  const [pluginUrl, setPluginUrl] = useState('');

  return (
    <>
      <h2 className="temp__h2">Plugin-Settings</h2>

      <div className="inputgroup">
        <label
          htmlFor="settings-git-token"
          className="inputgroup__label"
        >
          Add Plugin
        </label>
        <input
          type="text"
          className="settings__input"
          value={pluginUrl}
          onChange={({ target: { value } }) => setPluginUrl(value)}
        />
        <button
          type="button"
          className="button temp__button"
          disabled={!pluginUrl}
          onClick={() => {
            pluginAdd(pluginUrl);
            setPluginUrl('');
          }}
        >
          <SVG name="add" />
        </button>
      </div>


      <ul className="temp__items">
        {
          plugins.map(({ url, name, description }) => (
            <li
              className="temp__item"
              key={url}
            >
              <span
                className="temp__item-label"
              >
                <span>
                  {name}
                </span>
                <code>{url}</code>
                <br />
                <small>
                  {description}
                </small>
              </span>
              <button
                type="button"
                className="button temp__button"
                onClick={() => pluginRemove(url)}
              >
                <SVG name="delete" />
              </button>
            </li>
          ))
        }
      </ul>
    </>
  );
};

PluginSettings.propTypes = {
  pluginAdd: PropTypes.func.isRequired,
  pluginRemove: PropTypes.func.isRequired,
  plugins: PropTypes.array.isRequired,
};

export default PluginSettings;
