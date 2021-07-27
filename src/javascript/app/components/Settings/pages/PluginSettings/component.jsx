import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SVG from '../../../SVG';
import Input from '../../../Input';

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
      <Input
        id="plugin-settings-add-plugin"
        labelText="Add Plugin"
        type="text"
        value={pluginUrl}
        onChange={(value) => setPluginUrl(value)}
        buttonOnClick={() => {
          pluginAdd(pluginUrl);
          setPluginUrl('');
        }}
        buttonIcon={pluginUrl ? 'add' : null}
      />

      <ul className="plugin-settings__plugin-list">
        {
          plugins.map(({
            url,
            name,
            description,
            configParams = {},
            config = {},
            error,
            loading,
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
              {error && (
                <span
                  className="plugin-settings__plugin-warning"
                  title={error}
                >
                  <SVG name="warn" />
                </span>
              )}
              {loading && (
                <span
                  className="plugin-settings__plugin-loading"
                  title="Loading plugin"
                >
                  <SVG name="loading" />
                </span>
              )}
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
                    <Input
                      id={`${fieldName}-${pluginIndex}`}
                      key={`${fieldName}-${pluginIndex}`}
                      labelText={label}
                      type={inputTypeFromType(type)}
                      value={inputValueFromType(type, config[fieldName])}
                      onChange={(value) => {
                        pluginUpdateConfig(url, fieldName, inputValueFromType(type, value));
                      }}
                    />
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
