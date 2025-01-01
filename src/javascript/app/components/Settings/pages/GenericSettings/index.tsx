import type { ExportFrameMode } from 'gb-image-decoder';
import type { ILocale } from 'locale-codes';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import classnames from 'classnames';
import SVG from '../../../SVG';
import Input, { InputType } from '../../../Input';
import EnableWebUSB from '../../../WebUSBGreeting/EnableWebUSB';
import supportedCanvasImageFormats from '../../../../../tools/supportedCanvasImageFormats/index';
import cleanUrl from '../../../../../tools/cleanUrl';
import { getEnv } from '../../../../../tools/getEnv';
import exportFrameModes from '../../../../../consts/exportFrameModes';
import dateFormatLocale from '../../../../../tools/dateFormatLocale';
import getFrameGroups from '../../../../../tools/getFrameGroups';
import useItemsStore from '../../../../stores/itemsStore';
import useSettingsStore from '../../../../stores/settingsStore';
import usePaletteSort from '../../../../../hooks/usePaletteSort';
import type { PaletteSortMode } from '../../../../../consts/paletteSortModes';

function GenericSettings() {
  const {
    enableDebug,
    enableImageGroups,
    exportFileTypes,
    exportScaleFactors,
    forceMagicCheck,
    handleExportFrame,
    hideDates,
    importDeleted,
    importLastSeen,
    importPad,
    pageSize,
    preferredLocale,
    printerParams,
    printerUrl,
    savFrameTypes,
    setExportFileTypes,
    setExportScaleFactors,
    setEnableDebug,
    setEnableImageGroups,
    setForceMagicCheck,
    setHandleExportFrame,
    setHideDates,
    setImportDeleted,
    setImportLastSeen,
    setImportPad,
    setPageSize,
    setPreferredLocale,
    setSavFrameTypes,
    setPrinterParams,
    setPrinterUrl,
  } = useSettingsStore();

  const { frames, frameGroups } = useItemsStore();

  const savFrameGroups = getFrameGroups(frames, frameGroups);

  const [pageSizeState, setPageSizeState] = useState<string>(pageSize.toString(10));
  const [printerUrlState, setPrinterUrlState] = useState<string>(printerUrl);
  const [printerParamsState, setPrinterParamsState] = useState<string>(printerParams);
  const [localeCodes, setLocaleCodes] = useState<ILocale[]>([]);
  const [now] = useState(dayjs());

  const {
    sortPalettes,
    setSortPalettes,
    paletteSortOptions,
  } = usePaletteSort();

  useEffect(() => {
    const setLocales = async () => {
      const { default: locale } = await import(/* webpackChunkName: "loc" */ 'locale-codes');
      const filteredLocales: ILocale[] = locale.all.filter(({ tag }) => {
        try {
          dateFormatLocale(dayjs(), tag);
          return true;
        } catch (error) {
          return false;
        }
      });

      setLocaleCodes(filteredLocales);
    };

    setLocales();
  }, []);

  return (
    <>

      <Input
        id="settings-pagesize"
        labelText="Page size"
        type={InputType.NUMBER}
        min={0}
        value={pageSizeState}
        onChange={setPageSizeState}
        onBlur={() => {
          setPageSize(parseInt(pageSizeState, 10) || 0);
        }}
      >
        <span
          className={
            classnames('inputgroup__note', {
              'inputgroup__note--warn': !pageSize,
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
        {[1, 2, 3, 4, 5, 6, 8, 10].map((factor) => (
          <label
            key={factor}
            className={
              classnames('inputgroup__label-check', {
                'inputgroup__label-check--selected': exportScaleFactors.includes(factor),
              })
            }
            title={`${factor * 160}×${factor * 144}`}
          >
            {`${factor}×`}
            <input
              type="checkbox"
              checked={exportScaleFactors.includes(factor)}
              onChange={({ target }) => {
                setExportScaleFactors(factor, target.checked);
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
                'inputgroup__label-check--selected': exportFileTypes.includes(fileType),
              })
            }
            title={fileType}
          >
            {fileType}
            <input
              type="checkbox"
              checked={exportFileTypes.includes(fileType)}
              onChange={({ target }) => {
                setExportFileTypes(fileType, target.checked);
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
          value={handleExportFrame}
          onChange={(ev) => {
            setHandleExportFrame(ev.target.value as ExportFrameMode);
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
          disabled={!savFrameGroups.length}
          value={savFrameTypes}
          onChange={(ev) => {
            setSavFrameTypes(ev.target.value);
          }}
        >
          <option value="">None</option>
          {
            savFrameGroups.map(({ id, name }) => (
              <option value={id} key={id}>{ name }</option>
            ))
          }
        </select>
      </div>
      <label
        className={
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': importLastSeen,
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
            checked={importLastSeen}
            onChange={({ target }) => {
              setImportLastSeen(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>
      <label
        className={
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': importDeleted,
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
            checked={importDeleted}
            onChange={({ target }) => {
              setImportDeleted(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>
      <label
        className={
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': forceMagicCheck,
          })
        }
      >
        <span
          className="inputgroup__label"
          title="Force valid .sav file when importing"
        >
          Force valid .sav file when importing
        </span>
        <span
          className="checkgroup__checkbox-wrapper"
        >
          <input
            type="checkbox"
            className="checkgroup__input"
            checked={forceMagicCheck}
            onChange={({ target }) => {
              setForceMagicCheck(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>

      <label
        className={
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': importPad,
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
            checked={importPad}
            onChange={({ target }) => {
              setImportPad(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>

      <label
        className={
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': hideDates,
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
            checked={hideDates}
            onChange={({ target }) => {
              setHideDates(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>

      <div className="inputgroup">
        <label htmlFor="settings-sort-palettes" className="inputgroup__label">
          Sort Palettes
        </label>
        <select
          id="settings-sort-palettes"
          className="inputgroup__input inputgroup__input--select"
          value={sortPalettes}
          onChange={(ev) => {
            setSortPalettes(ev.target.value as PaletteSortMode);
          }}
        >
          {
            paletteSortOptions.map(({ label, value }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))
          }
        </select>
      </div>

      <div className="inputgroup">
        <label htmlFor="settings-preferred-locale" className="inputgroup__label">
          Preferred locale
          <span className="inputgroup__note inputgroup__note--newline">
            { `Example date format: ${dateFormatLocale(now, preferredLocale)}`}
          </span>
        </label>
        <select
          id="settings-preferred-locale"
          className="inputgroup__input inputgroup__input--select"
          value={preferredLocale}
          onChange={(ev) => {
            setPreferredLocale(ev.target.value);
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

      {(getEnv()?.env === 'esp8266') ? null : (
        <Input
          id="settings-printer-url"
          labelText="Printer URL"
          type={InputType.TEXT}
          value={printerUrlState}
          onChange={setPrinterUrlState}
          autoComplete="url"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onBlur={() => {
            const cleanPrinterUrl = cleanUrl(printerUrlState, 'http');
            setPrinterUrlState(cleanPrinterUrl);
            setPrinterUrl(cleanPrinterUrl);
          }}
          onKeyUp={(key) => {
            switch (key) {
              case 'Enter': {
                const cleanPrinterUrl = cleanUrl(printerUrlState, 'http');
                setPrinterUrlState(cleanPrinterUrl);
                setPrinterUrl(cleanPrinterUrl);
                break;
              }

              case 'Escape':
                setPrinterUrlState(printerUrl);
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
      {(getEnv()?.env === 'esp8266' || printerUrl) ? (
        <Input
          id="settings-printer-settings"
          labelText="Additional printer settings"
          type={InputType.TEXT}
          value={printerParamsState}
          onChange={setPrinterParamsState}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onBlur={() => {
            setPrinterParams(printerParamsState);
          }}
          onKeyUp={(key) => {
            switch (key) {
              case 'Enter':
                setPrinterParams(printerParamsState);
                break;
              case 'Escape':
                setPrinterParamsState(printerParams);
                break;
              default:
            }
          }}
        />
      ) : null}

      <label
        className={
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': enableDebug,
          })
        }
      >
        <span
          className="inputgroup__label"
          title="Show debug info"
        >
          Show debug info
        </span>
        <span
          className="checkgroup__checkbox-wrapper"
        >
          <input
            type="checkbox"
            className="checkgroup__input"
            checked={enableDebug}
            onChange={({ target }) => {
              setEnableDebug(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>

      <label
        className={
          classnames('inputgroup checkgroup', {
            'checkgroup--checked': enableImageGroups,
          })
        }
      >
        <span
          className="inputgroup__label"
          title="Enable Image Groups"
        >
          Enable Image Groups
        </span>
        <span
          className="checkgroup__checkbox-wrapper"
        >
          <input
            type="checkbox"
            className="checkgroup__input"
            checked={enableImageGroups}
            onChange={({ target }) => {
              setEnableImageGroups(target.checked);
            }}
          />
          <SVG name="checkmark" />
        </span>
      </label>
    </>
  );
}

export default GenericSettings;
