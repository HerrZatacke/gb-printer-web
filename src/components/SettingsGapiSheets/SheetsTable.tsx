import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CollectionsIcon from '@mui/icons-material/Collections';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ExtensionIcon from '@mui/icons-material/Extension';
import FilterIcon from '@mui/icons-material/Filter';
import GradientIcon from '@mui/icons-material/Gradient';
import ImageIcon from '@mui/icons-material/Image';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import JoinFullIcon from '@mui/icons-material/JoinFullRounded';
import PaletteIcon from '@mui/icons-material/Palette';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import useGapiSheetState from '@/contexts/GapiSheetStateContext';
import { SheetName, sheetNames } from '@/contexts/GapiSheetStateContext/consts';
import useGapiSync from '@/contexts/GapiSyncContext';
import { useItemsStore, useStoragesStore } from '@/stores/stores';


const toDate = (timestamp?: number): string => {
  if (!timestamp) {
    return 'N/A';
  }

  return (new Date(timestamp)).toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const getSign = (value: number): string => {
  switch (value) {
    case -1:
      return '<';
    case 1:
      return '>';
    default:
      return '=';
  }
};

const getIcon = (sheeName: SheetName) => {
  switch (sheeName) {
    case SheetName.IMAGES:
      return ImageIcon;
    case SheetName.RGBN_IMAGES:
      return GradientIcon;
    case SheetName.IMAGE_GROUPS:
      return CollectionsIcon;
    case SheetName.FRAMES:
      return ImageOutlinedIcon;
    case SheetName.FRAME_GROUPS:
      return FilterIcon;
    case SheetName.PALETTES:
      return PaletteIcon;
    case SheetName.PLUGINS:
      return ExtensionIcon;
    case SheetName.BIN_IMAGES:
      return DataObjectIcon;
    case SheetName.BIN_FRAMES:
      return DataObjectIcon;
  }
};

function SheetsTable() {
  const { gapiLastRemoteUpdates, sheets, updateSheets } = useGapiSheetState();
  const { gapiStorage } = useStoragesStore();
  const { busy, performPush, performPull, performMerge } = useGapiSync();
  const { gapiLastLocalUpdates } = useItemsStore();
  const t = useTranslations('SheetsTable');

  const disabled = busy || !gapiStorage.sheetId || !gapiStorage.use;

  return (
    <TableContainer
      component={Paper}
      sx={(theme) => ({
        '--color-match-same': `rgb(from ${theme.palette.success.main} r g b / 0.25)`,
        '--color-match-diff': `rgb(from ${theme.palette.error.main} r g b / 0.25)`,
      })}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">{t('id')}</TableCell>
            <TableCell align="right">{t('title')}</TableCell>
            <TableCell align="right">{t('columns')}</TableCell>
            <TableCell align="right">{t('rows')}</TableCell>
            <TableCell align="right">{t('lastRemoteUpdate')}</TableCell>
            <TableCell />
            <TableCell align="left">{t('lastLocalUpdate')}</TableCell>
            <TableCell align="right">
              <IconButton
                disabled={disabled}
                title={t('refreshStats')}
                onClick={updateSheets}
              >
                <RefreshIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sheetNames.map((sheetName) => {
            const properties = sheets.find((sheet) => (sheet.properties?.title === sheetName))?.properties;

            const remoteTimestamp = gapiLastRemoteUpdates?.[sheetName] || 0;
            const localTimestamp = gapiLastLocalUpdates?.[sheetName];
            const diff = Math.sign(remoteTimestamp - localTimestamp);
            const sort = sheetName !== SheetName.BIN_IMAGES && sheetName !== SheetName.BIN_FRAMES;
            const Icon = getIcon(sheetName);

            return (
              <TableRow
                key={sheetName}
                sx={{
                  '--color-match': diff ? 'var(--color-match-diff)' : 'var(--color-match-same)',
                }}
              >
                <TableCell align="right">{properties?.sheetId || 'N/A'}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" gap={1} alignItems="center" justifyContent="right">
                    <span>{sheetName}</span>
                    {Icon && <Icon />}
                  </Stack>
                </TableCell>
                <TableCell align="right">{properties?.gridProperties?.columnCount || 'N/A'}</TableCell>
                <TableCell align="right">{properties?.gridProperties?.rowCount || 'N/A'}</TableCell>
                <TableCell align="right" sx={{ backgroundColor: 'var(--color-match)' }}>{toDate(remoteTimestamp)}</TableCell>
                <TableCell align="center" sx={{ backgroundColor: 'var(--color-match)' }}>
                  <Typography variant="h4">
                    {diff > 0 && '✨ '}
                    {diff < 0 && '🕰️ '}
                    {getSign(diff)}
                    {diff > 0 && ' 🕰️'}
                    {diff < 0 && ' ✨'}
                  </Typography>
                </TableCell>
                <TableCell align="left" sx={{ backgroundColor: 'var(--color-match)' }}>{toDate(localTimestamp)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    disabled={disabled}
                    title={t('syncPush')}
                    onClick={() => performPush({
                      sheetName: sheetName,
                      newLastUpdateValue: localTimestamp,
                      merge: false,
                      sort,
                    })}
                  >
                    <CloudUploadIcon />
                  </IconButton>
                  <IconButton
                    disabled={disabled}
                    title={t('syncMerge')}
                    onClick={() => performMerge({
                      sheetName: sheetName,
                      lastRemoteUpdate: remoteTimestamp,
                      lastLocalUpdate: localTimestamp,
                      sort,
                    })}
                  >
                    <JoinFullIcon />
                  </IconButton>
                  <IconButton
                    disabled={disabled}
                    title={t('syncPull')}
                    onClick={() => performPull({
                      sheetName,
                      lastRemoteUpdate: remoteTimestamp,
                    })}
                  >
                    <CloudDownloadIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SheetsTable;
