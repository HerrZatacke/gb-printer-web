import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../../../SVG';
import Input from '../../../Input';

const GitSettings = ({ gitStorage, setGitStorage }) => {

  const [storage, setStorage] = useState(gitStorage);

  return (
    <>
      <label
        className={
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': storage.use,
          })
        }
      >
        <span
          className="inputgroup__label"
          title="Use github as storage"
        >
          Use github as storage
        </span>
        <span
          className="checkgroup__checkbox-wrapper"
        >
          <input
            type="checkbox"
            className="checkgroup__input"
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
          <Input
            id="settings-git-owner"
            labelText="Owner"
            type="text"
            value={storage.owner}
            onChange={(owner) => {
              setStorage({
                ...storage,
                owner,
              });
            }}
            onBlur={() => {
              setGitStorage(storage);
            }}
          />

          <Input
            id="settings-git-repo"
            labelText="Repository name"
            type="text"
            value={storage.repo}
            onChange={(repo) => {
              setStorage({
                ...storage,
                repo,
              });
            }}
            onBlur={() => {
              setGitStorage(storage);
            }}
          />

          <Input
            id="settings-git-branch"
            labelText="Branch"
            type="text"
            value={storage.branch}
            onChange={(branch) => {
              setStorage({
                ...storage,
                branch,
              });
            }}
            onBlur={() => {
              setGitStorage(storage);
            }}
          />

          <Input
            id="settings-git-throttle"
            labelText="Throttle (in ms)"
            type="number"
            min={10}
            max={5000}
            step={25}
            value={storage.throttle}
            onChange={(throttle) => {
              setStorage({
                ...storage,
                throttle,
              });
            }}
            onBlur={() => {
              setGitStorage(storage);
            }}
          />

          <Input
            id="settings-git-token"
            labelText="Token"
            type="password"
            value={storage.token}
            onChange={(token) => {
              setStorage({
                ...storage,
                token,
              });
            }}
            onBlur={() => {
              setGitStorage(storage);
            }}
          >
            <a
              className="inputgroup__note"
              href="https://github.com/settings/tokens/new?scopes=repo"
              target="_blank"
              rel="noreferrer"
            >
              How to obtain a token
            </a>
          </Input>
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
