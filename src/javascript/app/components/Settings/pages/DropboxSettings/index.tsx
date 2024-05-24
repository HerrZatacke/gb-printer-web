import React, { useState } from 'react';
import classnames from 'classnames';
import SVG from '../../../SVG';
import Input, { InputType } from '../../../Input';
import cleanPath from '../../../../../tools/cleanPath';
import { useDropboxSettings } from './useDropboxSettings';

const DropboxSettings = () => {
  const {
    use,
    loggedIn,
    logout,
    startAuth,
    setDropboxStorage,
    path: propsPath,
    autoDropboxSync,
  } = useDropboxSettings();
  const [path, setPath] = useState<string>(propsPath);

  return (
    <>
      <label
        className={
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': use,
          })
        }
      >
        <span
          className="inputgroup__label"
          title="Use Dropbox as storage"
        >
          Use Dropbox as storage
        </span>
        <span
          className="checkgroup__checkbox-wrapper"
        >
          <input
            type="checkbox"
            className="checkgroup__input"
            checked={use}
            onChange={({ target }) => {
              setDropboxStorage({
                use: target.checked,
              });
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>
      <Input
        id="dropbox-settings-path"
        value={path}
        type={InputType.TEXT}
        onChange={(value) => {
          setPath(value as string);
        }}
        onBlur={() => {
          setPath(cleanPath(path));
          setDropboxStorage({
            path: cleanPath(path),
          });
        }}
        labelText="Subfolder"
      >
        <a
          className="inputgroup__note"
          title={`Open Dropbox folder:\nhttps://www.dropbox.com/home/Apps/GameBoyPrinter/${path}`}
          href={`https://www.dropbox.com/home/Apps/GameBoyPrinter/${path}`}
          target="_blank"
          rel="noreferrer"
        >
          open
        </a>
      </Input>
      {
        !use ? null : (
          <>
            <label
              className={
                classnames('inputgroup checkgroup', {
                  'checkgroup--checked': autoDropboxSync,
                })
              }
            >
              <span
                className="inputgroup__label"
                title="Enable enhanced dropbox sync (experimental)"
              >
                Enable enhanced dropbox sync
                <span className="inputgroup__note inputgroup__note--warn">This is currently an experimental feature.</span>
              </span>
              <span
                className="checkgroup__checkbox-wrapper"
              >
                <input
                  type="checkbox"
                  className="checkgroup__input"
                  checked={autoDropboxSync}
                  onChange={({ target }) => {
                    setDropboxStorage({
                      autoDropboxSync: target.checked,
                    });

                    // Temporary refresh to start/stop polling in dropbox client
                    window.setTimeout(() => {
                      window.location.reload();
                    }, 300);
                  }}
                />
                <SVG name="checkmark" />
              </span>
            </label>
            <div className="inputgroup buttongroup">
              <button
                type="button"
                className="button"
                disabled={loggedIn}
                onClick={startAuth}
              >
                Authenticate
              </button>
              <button
                type="button"
                className="button"
                disabled={!loggedIn}
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </>
        )
      }
    </>
  );
};

export default DropboxSettings;
