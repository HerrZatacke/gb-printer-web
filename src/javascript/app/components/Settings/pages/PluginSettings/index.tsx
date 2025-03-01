import React, { useState } from 'react';
import SVG from '../../../SVG';
import Input, { InputType } from '../../../Input';
import useItemsStore from '../../../../stores/itemsStore';
import { usePluginsContext } from '../../../../contexts/plugins';

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
  const { plugins, deletePlugin, updatePluginConfig } = useItemsStore();
  const { validateAndAddPlugin } = usePluginsContext();
  const [pluginUrl, setPluginUrl] = useState('');

  return (
    <>
      <a
        rel="noreferrer noopener nofollow"
        href="https://herrzatacke.github.io/gb-printer-web-plugins/"
        className="plugin-settings__ext-link"
        target="_blank"
      >
        🔗 Some plugins can be found here
      </a>
      <Input
        id="plugin-settings-add-plugin"
        labelText="Add Plugin"
        type={InputType.TEXT}
        value={pluginUrl}
        autoComplete="url"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={setPluginUrl}
        buttonOnClick={async () => {
          if (await validateAndAddPlugin({ url: pluginUrl })) {
            setPluginUrl('');
          }
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
                onClick={() => deletePlugin(url)}
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
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      onChange={(value) => {
                        updatePluginConfig(url, fieldName, inputValueFromType(type, value));
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
