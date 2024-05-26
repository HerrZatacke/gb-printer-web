import React, { useState } from 'react';
import classnames from 'classnames';
import SVG from '../../../SVG';
import Input, { InputType } from '../../../Input';

import './index.scss';
import { useGitStorage } from './useGitStorage';

const GitSettings = () => {
  const { gitStorage, setGitStorage } = useGitStorage();
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
            type={InputType.TEXT}
            value={storage.owner}
            onChange={(owner) => {
              setStorage({
                ...storage,
                owner: owner as string,
              });
            }}
            onBlur={() => {
              setGitStorage(storage);
            }}
          />

          <Input
            id="settings-git-repo"
            labelText="Repository name"
            type={InputType.TEXT}
            value={storage.repo}
            onChange={(repo) => {
              setStorage({
                ...storage,
                repo: repo as string,
              });
            }}
            onBlur={() => {
              setGitStorage(storage);
            }}
          />

          <Input
            id="settings-git-branch"
            labelText="Branch"
            type={InputType.TEXT}
            value={storage.branch}
            onChange={(branch) => {
              setStorage({
                ...storage,
                branch: branch as string,
              });
            }}
            onBlur={() => {
              setGitStorage(storage);
            }}
          />

          <Input
            id="settings-git-throttle"
            labelText="Throttle (in ms)"
            type={InputType.NUMBER}
            min={10}
            max={5000}
            step={25}
            value={storage.throttle}
            onChange={(throttle) => {
              setStorage({
                ...storage,
                throttle: parseInt(throttle as string, 10),
              });
            }}
            onBlur={() => {
              setGitStorage(storage);
            }}
          />

          <Input
            id="settings-git-token"
            labelText="Token"
            type={InputType.PASSWORD}
            value={storage.token}
            onChange={(token) => {
              setStorage({
                ...storage,
                token: token as string,
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

export default GitSettings;