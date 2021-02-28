import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SVG from '../../../SVG';

const PluginSettings = ({ pluginAdd, pluginRemove, plugins }) => {

  const [pluginUrl, setPluginUrl] = useState('');

  return (
    <>
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
          className="button plugin-settings__button"
          disabled={!pluginUrl}
          onClick={() => {
            pluginAdd(pluginUrl);
            setPluginUrl('');
          }}
        >
          <SVG name="add" />
        </button>
      </div>


      <ul className="plugin-settings__plugin-list">
        {
          plugins.map(({ url, name, description }) => (
            <li
              className="plugin-settings__plugin"
              key={url}
            >
              <div
                className="plugin-settings__plugin-details"
              >
                <span
                  className="plugin-settings__plugin-name"
                >
                  {name}
                </span>
                <code
                  className="plugin-settings__plugin-url"
                >
                  {url}
                </code>
                <small
                  className="plugin-settings__plugin-description"
                >
                  {description}
                </small>
              </div>
              <button
                type="button"
                className="button plugin-settings__button plugin-settings__button--delete"
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
