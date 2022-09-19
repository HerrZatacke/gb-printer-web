import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import classnames from 'classnames';
import SVG from '../../../SVG';
import Input from '../../../Input';
import EnableWebUSB from '../../../WebUSBGreeting/EnableWebUSB';
import supportedCanvasImageFormats from '../../../../../tools/supportedCanvasImageFormats/index';
import cleanUrl from '../../../../../tools/cleanUrl';
import { getEnv } from '../../../../../tools/getEnv';
import exportFrameModes from '../../../../../consts/exportFrameModes';
import dateFormatLocale from '../../../../../tools/dateFormatLocale';

const GenericSettings = (props) => {
  const [pageSize, setPageSize] = useState(props.pageSize);
  const [printerUrl, setPrinterUrl] = useState(props.printerUrl);
  const [printerParams, setPrinterParams] = useState(props.printerParams);
  const [localeCodes, setLocaleCodes] = useState([]);
  const [now] = useState(dayjs());

  useEffect(() => {
    import(/* webpackChunkName: "loc" */ 'locale-codes')
      .then(({ default: locale }) => {

        const filteredLocales = locale.all.filter(({ tag }) => {
          try {
            dateFormatLocale(dayjs(), tag);
            return true;
          } catch (error) {
            return false;
          }
        });

        setLocaleCodes(filteredLocales);
      });
  }, []);

  return (
    <>

      <Input
        id="settings-pagesize"
        labelText="Page size"
        type="number"
        min={0}
        value={pageSize}
        onChange={(value) => {
          setPageSize(value);
        }}
        onBlur={() => {
          props.setPageSize(parseInt(pageSize, 10) || 0);
        }}
      >
        <span
          className={
            classnames('inputgroup__note', {
              'inputgroup__note--warn': !props.pageSize,
            })
          }
        >
          (set to 0 to disable pagination - might cause performance issues on large sets of images)
        </span>
      </Input>

      <div className="inputgroup">
        <div className="inputgroup__label">
          Image export dimensions
        </div>
        {[1, 2, 3, 4, 6, 8, 10].map((factor) => (
          <label
            key={factor}
            className={
              classnames('inputgroup__label-check', {
                'inputgroup__label-check--selected': props.exportScaleFactors.includes(factor),
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
      <div className="inputgroup">
        <div className="inputgroup__label">
          Image export filetypes
        </div>
        {[...supportedCanvasImageFormats(), 'txt', 'pgm'].map((fileType) => (
          <label
            key={fileType}
            className={
              classnames('inputgroup__label-check', {
                'inputgroup__label-check--selected': props.exportFileTypes.includes(fileType),
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

      <div className="inputgroup">
        <label htmlFor="settings-handle-export-frames" className="inputgroup__label">
          How to handle frames when exporting images
        </label>
        <select
          id="settings-handle-export-frames"
          className="inputgroup__input inputgroup__input--select"
          value={props.handleExportFrame}
          onChange={(ev) => {
            props.setHandleExportFrame(ev.target.value);
          }}
        >
          {
            exportFrameModes.map(({ id, name }) => (
              <option value={id} key={id}>{ name }</option>
            ))
          }
        </select>
      </div>

      <div className="inputgroup">
        <label htmlFor="settings-sav-frames" className="inputgroup__label">
          Frames to be applied when importing Cartridge dumps
        </label>
        <select
          id="settings-sav-frames"
          className="inputgroup__input inputgroup__input--select"
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
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': props.importLastSeen,
          })
        }
      >
        <span
          className="inputgroup__label"
          title="Import ‘last seen’ image when importing Cartridge dumps"
        >
          Import &lsquo;last seen&rsquo; image when importing Cartridge dumps
        </span>
        <span
          className="checkgroup__checkbox-wrapper"
        >
          <input
            type="checkbox"
            className="checkgroup__input"
            checked={props.importLastSeen}
            onChange={({ target }) => {
              props.setImportLastSeen(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>
      <label
        className={
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': props.importDeleted,
          })
        }
      >
        <span
          className="inputgroup__label"
          title="Import deleted images when importing Cartridge dumps"
        >
          Import deleted images when importing Cartridge dumps
        </span>
        <span
          className="checkgroup__checkbox-wrapper"
        >
          <input
            type="checkbox"
            className="checkgroup__input"
            checked={props.importDeleted}
            onChange={({ target }) => {
              props.setImportDeleted(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>

      <label
        className={
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': props.importPad,
          })
        }
      >
        <span
          className="inputgroup__label"
          title="Pad images up to 144px height on import"
        >
          Pad images up to 144px height on import
        </span>
        <span
          className="checkgroup__checkbox-wrapper"
        >
          <input
            type="checkbox"
            className="checkgroup__input"
            checked={props.importPad}
            onChange={({ target }) => {
              props.setImportPad(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>

      <label
        className={
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': props.hideDates,
          })
        }
      >
        <span
          className="inputgroup__label"
          title="Hide dates in gallery"
        >
          Hide dates in gallery
        </span>
        <span
          className="checkgroup__checkbox-wrapper"
        >
          <input
            type="checkbox"
            className="checkgroup__input"
            checked={props.hideDates}
            onChange={({ target }) => {
              props.setHideDates(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>

      <div className="inputgroup">
        <label htmlFor="settings-preferred-locale" className="inputgroup__label">
          Preferred locale
          <span className="inputgroup__note inputgroup__note--newline">
            { `Example date format: ${dateFormatLocale(now, props.preferredLocale)}`}
          </span>
        </label>
        <select
          id="settings-preferred-locale"
          className="inputgroup__input inputgroup__input--select"
          value={props.preferredLocale}
          onChange={(ev) => {
            props.setPreferredLocale(ev.target.value);
          }}
        >
          {
            localeCodes.map(({ name, local, location, tag }) => (
              <option value={tag} key={tag}>
                {`${local || name}${location ? ` - ${location}` : ''} (${tag})`}
              </option>
            ))
          }
        </select>
      </div>

      <EnableWebUSB />

      {(getEnv().env === 'esp8266') ? null : (
        <Input
          id="settings-printer-url"
          labelText="Printer URL"
          type="text"
          value={printerUrl}
          onChange={(value) => {
            setPrinterUrl(value);
          }}
          onBlur={() => {
            setPrinterUrl(cleanUrl(printerUrl, 'http'));
            props.updatePrinterUrl(printerUrl);
          }}
          onKeyUp={(key) => {
            switch (key) {
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
        >
          <span className="inputgroup__note">
            {'If you own a physical wifi-printer, you can add it\'s URL here and check the '}
            <Link to="/import">Import-tab</Link>
          </span>
        </Input>
      )}
      {(getEnv().env === 'esp8266' || printerUrl) ? (
        <Input
          id="settings-printer-settings"
          labelText="Additional printer settings"
          type="text"
          value={printerParams}
          onChange={(value) => {
            setPrinterParams(value);
          }}
          onBlur={() => {
            setPrinterParams(printerParams);
            props.updatePrinterParams(printerParams);
          }}
          onKeyUp={(key) => {
            switch (key) {
              case 'Enter':
                setPrinterParams(printerParams);
                props.updatePrinterParams(printerParams);
                break;
              case 'Escape':
                setPrinterParams(props.printerParams);
                break;
              default:
            }
          }}
        />
      ) : null}
    </>
  );
};

GenericSettings.propTypes = {
  changeExportScaleFactors: PropTypes.func.isRequired,
  exportScaleFactors: PropTypes.array.isRequired,
  changeExportFileTypes: PropTypes.func.isRequired,
  exportFileTypes: PropTypes.array.isRequired,
  savFrameTypes: PropTypes.string.isRequired,
  savFrameGroups: PropTypes.array.isRequired,
  setSavFrameTypes: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  setPageSize: PropTypes.func.isRequired,
  preferredLocale: PropTypes.string,
  setPreferredLocale: PropTypes.func.isRequired,
  setHandleExportFrame: PropTypes.func.isRequired,
  handleExportFrame: PropTypes.string.isRequired,
  setImportLastSeen: PropTypes.func.isRequired,
  importLastSeen: PropTypes.bool.isRequired,
  setImportDeleted: PropTypes.func.isRequired,
  importDeleted: PropTypes.bool.isRequired,
  setImportPad: PropTypes.func.isRequired,
  importPad: PropTypes.bool.isRequired,
  setHideDates: PropTypes.func.isRequired,
  hideDates: PropTypes.bool.isRequired,
  printerUrl: PropTypes.string.isRequired,
  updatePrinterUrl: PropTypes.func.isRequired,
  printerParams: PropTypes.string.isRequired,
  updatePrinterParams: PropTypes.func.isRequired,
};

GenericSettings.defaultProps = {
  preferredLocale: null,
};

export default GenericSettings;
