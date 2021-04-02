import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../../../SVG';
import Input from '../../../Input';
import cleanPath from '../../../../../tools/cleanPath';

const DropboxSettings = ({ use, loggedIn, logout, startAuth, setDropboxStorage, path: propsPath }) => {

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
      />
      {
        !use ? null : (
          <>
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
};

export default DropboxSettings;
