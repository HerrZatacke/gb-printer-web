import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../../../SVG';

const GitSettings = ({ gitStorage, setGitStorage }) => {

  const [storage, setStorage] = useState(gitStorage);
  const [showPass, setShowPass] = useState(false);

  return (
    <>
      <label
        className={
          classnames('inputgroup settings__check-group', {
            'settings__check-group--checked': storage.use,
          })
        }
      >
        <span
          className="inputgroup__label"
          title="Hide dates in gallery"
        >
          Use github as storage
        </span>
        <span
          className="settings__checkbox-wrap"
        >
          <input
            type="checkbox"
            className="settings__checkbox"
            checked={storage.use}
            onChange={({ target }) => {
              const newSettings = {
                ...storage,
                use: target.checked,
              };
              setStorage(newSettings);
              setGitStorage(newSettings);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>

      { !storage.use ? null : (
        <>
          <div className="inputgroup">
            <label
              htmlFor="settings-git-owner"
              className="inputgroup__label"
            >
              Owner
            </label>
            <input
              id="settings-git-owner"
              className="settings__input"
              value={storage.owner}
              onChange={({ target }) => {
                setStorage({
                  ...storage,
                  owner: target.value,
                });
              }}
              onBlur={() => {
                setGitStorage(storage);
              }}
            />
          </div>
          <div className="inputgroup">
            <label
              htmlFor="settings-git-repo"
              className="inputgroup__label"
            >
              Repository name
            </label>
            <input
              id="settings-git-repo"
              className="settings__input"
              value={storage.repo}
              onChange={({ target }) => {
                setStorage({
                  ...storage,
                  repo: target.value,
                });
              }}
              onBlur={() => {
                setGitStorage(storage);
              }}
            />
          </div>
          <div className="inputgroup">
            <label
              htmlFor="settings-git-branch"
              className="inputgroup__label"
            >
              Branch
            </label>
            <input
              id="settings-git-branch"
              className="settings__input"
              value={storage.branch}
              onChange={({ target }) => {
                setStorage({
                  ...storage,
                  branch: target.value,
                });
              }}
              onBlur={() => {
                setGitStorage(storage);
              }}
            />
          </div>
          <div className="inputgroup">
            <label
              htmlFor="settings-git-throttle"
              className="inputgroup__label"
            >
              Throttle (in ms)
            </label>
            <input
              id="settings-git-throttle"
              type="number"
              min="10"
              step="10"
              className="settings__input"
              value={storage.throttle}
              onChange={({ target }) => {
                setStorage({
                  ...storage,
                  throttle: target.value,
                });
              }}
              onBlur={() => {
                setGitStorage(storage);
              }}
            />
          </div>
          <div className="inputgroup">
            <label
              htmlFor="settings-git-token"
              className="inputgroup__label"
            >
              Token
              <a
                className="inputgroup__note"
                href="https://github.com/settings/tokens/new?scopes=repo"
              >
                How to obtain a token
              </a>
            </label>
            <input
              id="settings-git-token"
              type={showPass ? 'text' : 'password'}
              className="settings__input settings__input--password"
              value={storage.token}
              onChange={({ target }) => {
                setStorage({
                  ...storage,
                  token: target.value,
                });
              }}
              onBlur={() => {
                setGitStorage(storage);
                setShowPass(false);
              }}
            />
            <button
              type="button"
              className="settings__show-password-button"
              onClick={() => setShowPass(!showPass)}
            >
              <SVG name="view" />
            </button>
          </div>
        </>
      )}
    </>
  );
};

GitSettings.propTypes = {
  gitStorage: PropTypes.object.isRequired,
  setGitStorage: PropTypes.func.isRequired,
};

export default GitSettings;
