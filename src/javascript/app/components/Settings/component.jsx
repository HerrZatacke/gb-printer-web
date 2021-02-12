import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SocketStateIndicator from '../SocketStateIndicator';
import cleanUrl from '../../../tools/cleanUrl';
import { getEnv } from '../../../tools/getEnv';
import supportedCanvasImageFormats from '../../../tools/supportedCanvasImageFormats/index';
import SVG from '../SVG';

const Settings = (props) => {

  const { env } = getEnv();

  const [socketUrl, setSocketUrl] = useState(props.socketUrl);
  const [printerUrl, setPrinterUrl] = useState(props.printerUrl);
  const [pageSize, setPageSize] = useState(props.pageSize);
  const [gitStorage, setGitStorage] = useState(props.gitStorage);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="settings">
      <div className="settings__inputgroup">
        <label
          htmlFor="settings-pagesize"
          className="settings__label"
        >
          Page size
          <span
            className={
              classnames('settings__note', {
                'settings__note--warn': !props.pageSize,
              })
            }
          >
            (set to 0 to disable pagination - might cause performance issues on large sets of images)
          </span>
        </label>
        <input
          id="settings-pagesize"
          className="settings__input"
          type="number"
          min="0"
          value={pageSize}
          onChange={({ target }) => {
            setPageSize(target.value);
          }}
          onBlur={() => {
            props.setPageSize(parseInt(pageSize, 10) || 0);
          }}
        />
      </div>
      <div className="settings__inputgroup">
        <div className="settings__label">
          Image export dimensions
        </div>
        {[1, 2, 3, 4, 6, 8, 10].map((factor) => (
          <label
            key={factor}
            className={
              classnames('settings__label-check', {
                'settings__label-check--selected': props.exportScaleFactors.includes(factor),
              })
            }
            title={`${factor * 160}×${factor * 144}`}
          >
            {`${factor}×`}
            <input
              type="checkbox"
              checked={props.exportScaleFactors.includes(factor)}
              onChange={({ target }) => {
                props.changeExportScaleFactors(factor, target.checked);
              }}
            />
          </label>
        ))}
      </div>
      <div className="settings__inputgroup">
        <div className="settings__label">
          Image export filetypes
        </div>
        {[...supportedCanvasImageFormats(), 'txt'].map((fileType) => (
          <label
            key={fileType}
            className={
              classnames('settings__label-check', {
                'settings__label-check--selected': props.exportFileTypes.includes(fileType),
              })
            }
            title={fileType}
          >
            {fileType}
            <input
              type="checkbox"
              checked={props.exportFileTypes.includes(fileType)}
              onChange={({ target }) => {
                props.changeExportFileTypes(fileType, target.checked);
              }}
            />
          </label>
        ))}
      </div>
      <label
        className={
          classnames('settings__inputgroup settings__check-group', {
            'settings__check-group--checked': props.exportCropFrame,
          })
        }
      >
        <span
          className="settings__label"
          title="Crop/remove frame when exporting or sharing images"
        >
          Crop/remove frame when exporting or sharing images
        </span>
        <span
          className="settings__checkbox-wrap"
        >
          <input
            type="checkbox"
            className="settings__checkbox"
            checked={props.exportCropFrame}
            onChange={({ target }) => {
              props.setExportCropFrame(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>
      {(env !== 'webpack-dev') ? null : (
        <>
          <div className="settings__inputgroup">
            <label htmlFor="settings-socket-url" className="settings__label">
              Remote Socket URL
              <SocketStateIndicator />
            </label>
            <input
              id="settings-socket-url"
              className="settings__input"
              value={socketUrl}
              onChange={({ target }) => {
                setSocketUrl(target.value);
              }}
              onBlur={() => {
                setSocketUrl(cleanUrl(socketUrl, 'ws'));
              }}
              onKeyUp={(ev) => {
                switch (ev.key) {
                  case 'Enter':
                    setSocketUrl(cleanUrl(socketUrl, 'ws'));
                    break;
                  case 'Escape':
                    setSocketUrl(props.socketUrl);
                    break;
                  default:
                }
              }}
            />
            <button
              type="button"
              className="button"
              onClick={() => {
                props.updateSocketUrl(cleanUrl(socketUrl, 'ws'));
              }}
            >
              Connect
            </button>
          </div>
          <div className="settings__inputgroup">
            <label htmlFor="settings-printer-url" className="settings__label">
              Printer URL
            </label>
            <input
              id="settings-printer-url"
              className="settings__input"
              value={printerUrl}
              onChange={({ target }) => {
                setPrinterUrl(target.value);
              }}
              onBlur={() => {
                setPrinterUrl(cleanUrl(printerUrl, 'http'));
                props.updatePrinterUrl(printerUrl);
              }}
              onKeyUp={(ev) => {
                switch (ev.key) {
                  case 'Enter':
                    setPrinterUrl(cleanUrl(printerUrl, 'http'));
                    props.updatePrinterUrl(printerUrl);
                    break;
                  case 'Escape':
                    setPrinterUrl(props.printerUrl);
                    break;
                  default:
                }
              }}
            />
          </div>
        </>
      )}
      <div className="settings__inputgroup">
        <label htmlFor="settings-sav-frames" className="settings__label">
          Frames to be applied when importing Cartridge dumps
        </label>
        <select
          id="settings-sav-frames"
          className="settings__input settings__input--select"
          disabled={!props.savFrameGroups.length}
          value={props.savFrameTypes}
          onChange={(ev) => {
            props.setSavFrameTypes(ev.target.value);
          }}
        >
          {
            props.savFrameGroups.map(({ id, name }) => (
              <option value={id} key={id}>{ name }</option>
            ))
          }
        </select>
      </div>

      <label
        className={
          classnames('settings__inputgroup settings__check-group', {
            'settings__check-group--checked': props.hideDates,
          })
        }
      >
        <span
          className="settings__label"
          title="Hide dates in gallery"
        >
          Hide dates in gallery
        </span>
        <span
          className="settings__checkbox-wrap"
        >
          <input
            type="checkbox"
            className="settings__checkbox"
            checked={props.hideDates}
            onChange={({ target }) => {
              props.setHideDates(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>
      <label
        className={
          classnames('settings__inputgroup settings__check-group', {
            'settings__check-group--checked': gitStorage.use,
          })
        }
      >
        <span
          className="settings__label"
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
            checked={gitStorage.use}
            onChange={({ target }) => {
              const newSettings = {
                ...gitStorage,
                use: target.checked,
              };
              setGitStorage(newSettings);
              props.setGitStorage(newSettings);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>

      { !gitStorage.use ? null : (
        <>
          <div className="settings__inputgroup">
            <label
              htmlFor="settings-git-owner"
              className="settings__label"
            >
              Owner
            </label>
            <input
              id="settings-git-owner"
              className="settings__input"
              value={gitStorage.owner}
              onChange={({ target }) => {
                setGitStorage({
                  ...gitStorage,
                  owner: target.value,
                });
              }}
              onBlur={() => {
                props.setGitStorage(gitStorage);
              }}
            />
          </div>
          <div className="settings__inputgroup">
            <label
              htmlFor="settings-git-repo"
              className="settings__label"
            >
              Repository name
            </label>
            <input
              id="settings-git-repo"
              className="settings__input"
              value={gitStorage.repo}
              onChange={({ target }) => {
                setGitStorage({
                  ...gitStorage,
                  repo: target.value,
                });
              }}
              onBlur={() => {
                props.setGitStorage(gitStorage);
              }}
            />
          </div>
          <div className="settings__inputgroup">
            <label
              htmlFor="settings-git-branch"
              className="settings__label"
            >
              Branch
            </label>
            <input
              id="settings-git-branch"
              className="settings__input"
              value={gitStorage.branch}
              onChange={({ target }) => {
                setGitStorage({
                  ...gitStorage,
                  branch: target.value,
                });
              }}
              onBlur={() => {
                props.setGitStorage(gitStorage);
              }}
            />
          </div>
          <div className="settings__inputgroup">
            <label
              htmlFor="settings-git-throttle"
              className="settings__label"
            >
              Throttle (in ms)
            </label>
            <input
              id="settings-git-throttle"
              type="number"
              min="10"
              step="10"
              className="settings__input"
              value={gitStorage.throttle}
              onChange={({ target }) => {
                setGitStorage({
                  ...gitStorage,
                  throttle: target.value,
                });
              }}
              onBlur={() => {
                props.setGitStorage(gitStorage);
              }}
            />
          </div>
          <div className="settings__inputgroup">
            <label
              htmlFor="settings-git-token"
              className="settings__label"
            >
              Token
              <a
                className="settings__note"
                href="https://github.com/settings/tokens/new?scopes=repo"
              >
                How to obtain a token
              </a>
            </label>
            <input
              id="settings-git-token"
              type={showPass ? 'text' : 'password'}
              className="settings__input settings__input--password"
              value={gitStorage.token}
              onChange={({ target }) => {
                setGitStorage({
                  ...gitStorage,
                  token: target.value,
                });
              }}
              onBlur={() => {
                props.setGitStorage(gitStorage);
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

      <div className="settings__inputgroup buttongroup">
        <button
          type="button"
          className="button"
          onClick={() => props.exportJson('debug')}
        >
          Export debug settings
        </button>
        <button
          type="button"
          className="button"
          onClick={() => props.exportJson('settings')}
        >
          Export settings
        </button>
      </div>
    </div>
  );
};

Settings.propTypes = {
  changeExportScaleFactors: PropTypes.func.isRequired,
  exportScaleFactors: PropTypes.array.isRequired,
  changeExportFileTypes: PropTypes.func.isRequired,
  exportFileTypes: PropTypes.array.isRequired,
  printerUrl: PropTypes.string.isRequired,
  savFrameTypes: PropTypes.string.isRequired,
  savFrameGroups: PropTypes.array.isRequired,
  socketUrl: PropTypes.string.isRequired,
  updateSocketUrl: PropTypes.func.isRequired,
  updatePrinterUrl: PropTypes.func.isRequired,
  setSavFrameTypes: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  setPageSize: PropTypes.func.isRequired,
  gitStorage: PropTypes.object.isRequired,
  setGitStorage: PropTypes.func.isRequired,
  exportJson: PropTypes.func.isRequired,
  setExportCropFrame: PropTypes.func.isRequired,
  exportCropFrame: PropTypes.bool.isRequired,
  setHideDates: PropTypes.func.isRequired,
  hideDates: PropTypes.bool.isRequired,
};

Settings.defaultProps = {};

export default Settings;
