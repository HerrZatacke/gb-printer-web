import React, { useState } from 'react';
import SVG from '../../../SVG';
import Input, { InputType } from '../../../Input';
import { usePlugins } from './usePlugins';

import './index.scss';

const inputTypeFromType = (type: string): InputType => {
  switch (type) {
    case 'number':
      return InputType.NUMBER;
    case 'string':
      return InputType.TEXT;
    case 'multiline':
      return InputType.TEXTAREA;
    default:
      return InputType.TEXT;
  }
};

const inputValueFromType = (type: string, value: string): string | number => {
  switch (type) {
    case 'number': {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    }

    case 'string':
      return value || '';

    default:
      return value;
  }
};

function PluginSettings() {

  const [pluginUrl, setPluginUrl] = useState('');

  const { pluginAdd, pluginRemove, pluginUpdateConfig, plugins } = usePlugins();

  return (
    <>
      <Input
        id="plugin-settings-add-plugin"
        labelText="Add Plugin"
        type={InputType.TEXT}
        value={pluginUrl}
        onChange={setPluginUrl}
        buttonOnClick={() => {
          pluginAdd(pluginUrl);
          setPluginUrl('');
        }}
        buttonIcon={pluginUrl ? 'add' : undefined}
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
                      value={inputValueFromType(type, config[fieldName] as string)}
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
}

export default PluginSettings;
