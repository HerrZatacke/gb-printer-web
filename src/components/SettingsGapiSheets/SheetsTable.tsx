import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import useGapiSync from '@/contexts/GapiSheetStateContext';
import { SheetName } from '@/contexts/GapiSheetStateContext/consts';
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
  const { gapiLastRemoteUpdates } = useGapiSync();
  const { gapiLastLocalUpdates } = useItemsStore();
  const { sheets } = useGapiSync();

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
          </TableRow>
        </TableHead>
        <TableBody>
          {sheets.map(({ properties }) => {
            if (!properties) {
              return null;
            }

            return (
              <TableRow key={properties.sheetId}>
                <TableCell align="right">{properties.sheetId}</TableCell>
                <TableCell align="right">{properties.title}</TableCell>
                <TableCell align="right">{properties.gridProperties?.columnCount}</TableCell>
                <TableCell align="right">{properties.gridProperties?.rowCount}</TableCell>
                <TableCell align="right">{toDate(gapiLastRemoteUpdates?.[properties.title as SheetName])}</TableCell>
                <TableCell align="right">{toDate(gapiLastLocalUpdates?.[properties.title as SheetName])}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SheetsTable;
