import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import useGapiSheetState from '@/contexts/GapiSheetStateContext';
import { sheetNames } from '@/contexts/GapiSheetStateContext/consts';
import useGapiSync from '@/contexts/GapiSyncContext';
import { useItemsStore } from '@/stores/stores';

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

function SheetsTable() {
  const { gapiLastRemoteUpdates, sheets } = useGapiSheetState();
  const { busy, performPush, performPull } = useGapiSync();
  const { gapiLastLocalUpdates } = useItemsStore();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">Columns</TableCell>
            <TableCell align="right">Rows</TableCell>
            <TableCell align="right">Last Remote Update</TableCell>
            <TableCell align="right">Last Local Update</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {sheetNames.map((sheetName) => {
            const properties = sheets.find((sheet) => (sheet.properties?.title === sheetName))?.properties;

            return (
              <TableRow
                key={sheetName}
                sx={{
                  '--color-match': (gapiLastRemoteUpdates?.[sheetName] === gapiLastLocalUpdates?.[sheetName] ? '#040' : '#400'),
                }}
              >
                <TableCell align="right">{properties?.sheetId || 'N/A'}</TableCell>
                <TableCell align="right">{sheetName}</TableCell>
                <TableCell align="right">{properties?.gridProperties?.columnCount || 'N/A'}</TableCell>
                <TableCell align="right">{properties?.gridProperties?.rowCount || 'N/A'}</TableCell>
                <TableCell align="right" sx={{ backgroundColor: 'var(--color-match)' }}>{toDate(gapiLastRemoteUpdates?.[sheetName])}</TableCell>
                <TableCell align="right" sx={{ backgroundColor: 'var(--color-match)' }}>{toDate(gapiLastLocalUpdates?.[sheetName])}</TableCell>
                <TableCell align="center">
                  {gapiLastLocalUpdates?.[sheetName]}
                  <button disabled={busy} onClick={() => performPush(sheetName, gapiLastLocalUpdates?.[sheetName])}>Uppy!</button>
                  <button disabled={busy} onClick={() => performPull(sheetName)}>Pully!</button>
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
