import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SocketStateIndicator from '../SocketStateIndicator';
import cleanUrl from '../../../tools/cleanUrl';
import { getEnv } from '../../../tools/getEnv';
import supportedCanvasImageFormats from '../../../tools/supportedCanvasImageFormats/îndex';
import SVG from '../SVG';

const Settings = (props) => {

  const { env } = getEnv();

  const [socketUrl, setSocketUrl] = useState(props.socketUrl);
  const [printerUrl, setPrinterUrl] = useState(props.printerUrl);
  const [pageSize, setPageSize] = useState(props.pageSize);

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
        {supportedCanvasImageFormats().map((fileType) => (
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
              className="settings__button"
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
        <label htmlFor="settings-printer-url" className="settings__label">
          Frames to be applied when importing Cartridge dumps
        </label>
        <select
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

      <div className="settings__inputgroup settings__buttongroup">
        <button
          type="button"
          className="settings__button"
          onClick={() => props.exportSettings('debug')}
        >
          Export debug settings
        </button>
        <button
          type="button"
          className="settings__button"
          onClick={() => props.exportSettings('settings')}
        >
          Export settings
        </button>
        <button
          type="button"
          className="settings__button"
          onClick={() => props.exportSettings('images')}
        >
          Export images
        </button>
        <button
          type="button"
          className="settings__button"
          onClick={() => props.exportSettings('frames')}
        >
          Export frames
        </button>
        <button
          type="button"
          className="settings__button"
          onClick={() => props.exportSettings('full')}
        >
          Export everything
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
  exportSettings: PropTypes.func.isRequired,
  setExportCropFrame: PropTypes.func.isRequired,
  exportCropFrame: PropTypes.bool.isRequired,
  setHideDates: PropTypes.func.isRequired,
  hideDates: PropTypes.bool.isRequired,
};

Settings.defaultProps = {};

export default Settings;
