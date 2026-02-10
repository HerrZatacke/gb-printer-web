import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import JoinFullIcon from '@mui/icons-material/JoinFullRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import useGapiSheetState from '@/contexts/GapiSheetStateContext';
import { sheetNames } from '@/contexts/GapiSheetStateContext/consts';
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

function SheetsTable() {
  const { gapiLastRemoteUpdates, sheets, updateSheets } = useGapiSheetState();
  const { gapiStorage } = useStoragesStore();
  const { busy, performPush, performPull, performMerge } = useGapiSync();
  const { gapiLastLocalUpdates } = useItemsStore();

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
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">Columns</TableCell>
            <TableCell align="right">Rows</TableCell>
            <TableCell align="right">Last Remote Update</TableCell>
            <TableCell />
            <TableCell align="left">Last Local Update</TableCell>
            <TableCell align="right">
              <IconButton
                disabled={disabled}
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

            return (
              <TableRow
                key={sheetName}
                sx={{
                  '--color-match': diff ? 'var(--color-match-diff)' : 'var(--color-match-same)',
                }}
              >
                <TableCell align="right">{properties?.sheetId || 'N/A'}</TableCell>
                <TableCell align="right">{sheetName}</TableCell>
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
                    onClick={() => performPush(sheetName, localTimestamp, false)}
                  >
                    <CloudUploadIcon />
                  </IconButton>
                  <IconButton
                    disabled={disabled}
                    onClick={() => performMerge(sheetName, remoteTimestamp, localTimestamp)}
                  >
                    <JoinFullIcon />
                  </IconButton>
                  <IconButton
                    disabled={disabled}
                    onClick={() => performPull(sheetName, remoteTimestamp)}
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
