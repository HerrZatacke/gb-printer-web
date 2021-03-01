import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SVG from '../../../SVG';

const inputTypeFromType = (type) => {
  switch (type) {
    case 'number':
      return 'number';
    case 'string':
      return 'text';
    default:
      return 'text';
  }
};

const inputValueFromType = (type, value) => {
  switch (type) {
    case 'number': {
      const num = parseFloat(value);
      return isNaN(num) ? '' : num;
    }

    case 'string':
      return value || '';

    default:
      return value;
  }
};

const PluginSettings = ({
  pluginAdd,
  pluginRemove,
  pluginUpdateConfig,
  plugins,
}) => {

  const [pluginUrl, setPluginUrl] = useState('');

  return (
    <>
      <div className="inputgroup">
        <label
          htmlFor="plugin-settings-add-plugin"
          className="inputgroup__label"
        >
          Add Plugin
        </label>
        <input
          id="plugin-settings-add-plugin"
          type="text"
          className="inputgroup__input"
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
          plugins.map(({
            url,
            name,
            description,
            configParams = {},
            config = {},
          }, pluginIndex) => (
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
              <div className="plugin-settings__config-options">
                {Object.keys(configParams).map((fieldName) => {
                  const { type, label } = configParams[fieldName];
                  return (
                    <div
                      key={fieldName}
                      className="inputgroup"
                    >
                      <label
                        htmlFor={`${fieldName}-${pluginIndex}`}
                        className="inputgroup__label"
                      >
                        {label}
                      </label>
                      <input
                        id={`${fieldName}-${pluginIndex}`}
                        type={inputTypeFromType(type)}
                        className="settings__input"
                        value={inputValueFromType(type, config[fieldName])}
                        onChange={({ target: { value } }) => {
                          pluginUpdateConfig(url, fieldName, inputValueFromType(type, value));
                        }}
                      />
                    </div>
                  );
                })}
              </div>

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
  pluginUpdateConfig: PropTypes.func.isRequired,
  plugins: PropTypes.array.isRequired,
};

export default PluginSettings;
