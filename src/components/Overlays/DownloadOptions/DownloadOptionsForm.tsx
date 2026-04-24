import {
  Badge,
  Box,
  FormControl,
  FormControlLabel, FormHelperText,
  InputLabel,
  MenuItem,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { type ExportFrameMode } from 'gb-image-decoder';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import exportFrameModes from '@/consts/exportFrameModes';
import { FileNameStyle, fileNameStyleLabels } from '@/consts/fileNameStyles';
import { useDownloadInfo } from '@/hooks/useDownloadInfo';
import { useSettingsStore } from '@/stores/stores';
import { bitmapFileTypes, TestFileType } from '@/tools/supportedCanvasImageFormats';

interface Props {
  inDialog: boolean;
}

function DownloadOptionsForm({ inDialog }: Props) {
  const t = useTranslations('DownloadOptionsForm');

  const {
    alwaysShowDownloadDialog,
    exportScaleFactors,
    fileNameStyle,
    handleExportFrame,
    setAlwaysShowDownloadDialog,
    setExportFileTypes,
    setExportScaleFactors,
    setFileNameStyle,
    setHandleExportFrame,
  } = useSettingsStore();

  const {
    exportFileTypes,
    supportedExportFileTypes,
    fileTypeCounts,
    rgbnCount,
    monochromeCount,
  } = useDownloadInfo();


  const getBadgeContent = useCallback((fileType: string): number | null => {
    if (!exportFileTypes.includes(fileType)) {
      return null;
    }

    const isBitmap = bitmapFileTypes.includes(fileType as TestFileType);

    const count = fileTypeCounts[fileType];

    if (typeof count === 'undefined') {
      return null;
    }

    if (fileType === TestFileType.JSON && count) {
      return 1;
    }

    if (isBitmap) {
      return count * exportScaleFactors.length;
    }

    return count;
  }, [exportFileTypes, exportScaleFactors.length, fileTypeCounts]);


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
          {supportedExportFileTypes.map((fileType) => {
            const badgeContent = inDialog && getBadgeContent(fileType);
            return (
              <ToggleButton
                key={fileType}
                value={fileType}
                title={fileType}
              >
                <Badge
                  key={fileType}
                  badgeContent={badgeContent}
                  showZero
                  color={fileTypeCounts[fileType] ? 'info' : 'error'}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  sx={{ width: '100%' }}
                >
                  <Box sx={{ width: '100%' }}>
                    {fileType}
                  </Box>
                </Badge>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
        {inDialog && (
          <FormHelperText>
            {t('fileTypeInfo', { rgbnCount, monochromeCount })}
          </FormHelperText>
        )}
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
