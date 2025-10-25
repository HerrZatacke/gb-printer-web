import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import type { ExportFrameMode } from 'gb-image-decoder';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import exportFrameModes from '@/consts/exportFrameModes';
import { FileNameStyle, fileNameStyleLabels } from '@/consts/fileNameStyles';
import useSettingsStore from '@/stores/settingsStore';
import supportedCanvasImageFormats from '@/tools/supportedCanvasImageFormats';

interface Props {
  inDialog: boolean,
}

function DownloadOptionsForm({ inDialog }: Props) {
  const t = useTranslations('DownloadOptionsForm');

  const {
    alwaysShowDownloadDialog,
    exportFileTypes,
    exportScaleFactors,
    fileNameStyle,
    handleExportFrame,
    setAlwaysShowDownloadDialog,
    setExportFileTypes,
    setExportScaleFactors,
    setFileNameStyle,
    setHandleExportFrame,
  } = useSettingsStore();

  const [supportedExportFileTypes, setSupportedExportFileTypes] = useState<string[]>(['txt', 'pgm']);

  useEffect(() => {
    setSupportedExportFileTypes([
      ...supportedCanvasImageFormats(),
      'txt',
      'pgm',
    ]);
  }, []);

  return (
    <>
      <FormControl>
        <InputLabel shrink>
          {t('exportDimensions')}
        </InputLabel>
        <ToggleButtonGroup
          fullWidth
          value={exportScaleFactors}
          onChange={(_, value) => {
            setExportScaleFactors(value);
          }}
        >
          {[1, 2, 3, 4, 5, 6, 8, 10].map((factor) => (
            <ToggleButton
              key={factor}
              value={factor}
              title={`${factor * 160}×${factor * 144}`}
            >
              {`${factor}×`}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormControl>

      <FormControl>
        <InputLabel shrink>
          {t('exportFiletypes')}
        </InputLabel>
        <ToggleButtonGroup
          fullWidth
          value={exportFileTypes}
          onChange={(_, value) => {
            setExportFileTypes(value);
          }}
        >
          {supportedExportFileTypes.map((fileType) => (
            <ToggleButton
              key={fileType}
              value={fileType}
              title={fileType}
            >
              { fileType }
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormControl>

      <TextField
        value={handleExportFrame}
        label={t('exportHandleFrame')}
        select
        onChange={(ev) => {
          setHandleExportFrame(ev.target.value as ExportFrameMode);
        }}
      >
        {
          exportFrameModes.map(({ id, name }) => (
            <MenuItem
              key={id}
              value={id}
            >
              {t(name)}
            </MenuItem>
          ))
        }
      </TextField>

      <TextField
        value={fileNameStyle}
        label={t('filenameStyle')}
        select
        onChange={(ev) => {
          setFileNameStyle(ev.target.value as FileNameStyle);
        }}
      >
        {
          fileNameStyleLabels.map(({ id, name }) => (
            <MenuItem
              key={id}
              value={id}
            >
              {t(name)}
            </MenuItem>
          ))
        }
      </TextField>

      <Box>
        <FormControlLabel
          label={t(inDialog ? 'alwaysShowDownloadDialogInDialog' : 'alwaysShowDownloadDialogInForm')}
          control={(
            <Switch
              checked={alwaysShowDownloadDialog}
              onChange={({ target }) => {
                setAlwaysShowDownloadDialog(target.checked);
              }}
            />
          )}
        />
        {inDialog && (
          <Typography
            variant="caption"
            component="p"
          >
            {t('alwaysShowDownloadDialogHelper')}
          </Typography>
        )}
      </Box>
    </>
  );
}

export default DownloadOptionsForm;
