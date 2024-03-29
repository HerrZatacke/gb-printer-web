import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../../../SVG';
import Input from '../../../Input';
import cleanPath from '../../../../../tools/cleanPath';

const DropboxSettings = ({ use, loggedIn, logout, startAuth, setDropboxStorage, path: propsPath, autoDropboxSync }) => {

  const [path, setPath] = useState(propsPath);

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
        onChange={setPath}
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

DropboxSettings.propTypes = {
  logout: PropTypes.func.isRequired,
  startAuth: PropTypes.func.isRequired,
  setDropboxStorage: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  use: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  autoDropboxSync: PropTypes.bool.isRequired,
};

export default DropboxSettings;
