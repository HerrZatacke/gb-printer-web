import React, { useState } from 'react';
import classnames from 'classnames';
import SVG from '../../../SVG';
import Input, { InputType } from '../../../Input';
import useStoragesStore from '../../../../stores/storagesStore';
import './index.scss';

function GitSettings() {
  const { gitStorage, setGitStorage } = useStoragesStore();
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
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
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
            type={InputType.TEXT}
            value={storage.repo}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
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
            type={InputType.TEXT}
            value={storage.branch}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
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
            type={InputType.NUMBER}
            min={10}
            max={5000}
            step={25}
            value={storage.throttle}
            onChange={(throttle) => {
              setStorage({
                ...storage,
                throttle: parseInt(throttle, 10),
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
                token,
              });
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            onBlur={() => {
              setGitStorage(storage);
            }}
          >
            <span className="inputgroup__note">
              {'Go to GitHub to create a '}
              <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noreferrer"
              >
                new fine-grained personal access token
              </a>
              {', select the repository you want to use for synching and allow read/write for '}
              <code className="inputgroup__note--code">
                &quot;Repositoty Permissions &gt; Contents&quot;
              </code>
            </span>
          </Input>
        </>
      )}
    </>
  );
}

export default GitSettings;
