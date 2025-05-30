import React from 'react';
import filesize from 'filesize';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { usePrinter } from './usePrinter';
import { PrinterFunction } from '../../../consts/printerFunction';

const functionLabels: Record<PrinterFunction, string> = {
  testFile: 'Print test image',
  checkPrinter: 'Check Printer',
  fetchImages: '',
  clearPrinter: 'Clear Printer',
};

const getFetchImagesLabel = (dumpsLength: number): string => (
  dumpsLength ? `Fetch ${dumpsLength} images` : 'Fetch images'
);

function PrinterReport() {
  const {
    printerData,
    printerFunctions,
    printerConnected,
    callRemoteFunction,
    printerBusy,
  } = usePrinter();

  if (!printerConnected) {
    return null;
  }

  return (
    <Stack direction="column" gap={2}>
      <ButtonGroup
        variant="contained"
        fullWidth
      >
        {printerFunctions.map((name) => (
          <Button
            key={name}
            disabled={
              printerBusy ||
              (
                [PrinterFunction.FETCHIMAGES, PrinterFunction.CLEARPRINTER].includes(name) &&
                !printerData?.dumps?.length
              )
            }
            onClick={() => callRemoteFunction(name)}
          >
            {
              name === PrinterFunction.FETCHIMAGES ?
                getFetchImagesLabel(printerData?.dumps?.length || 0) :
                functionLabels[name as PrinterFunction]
            }
          </Button>
        ))}
      </ButtonGroup>

      {
        (printerData?.message) ? (
          <Alert severity="info">
            { printerData?.message }
          </Alert>
        ) : null
      }

      {
        (printerData?.fs && printerData?.dumps) ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Printer Filesystem</TableCell>
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="left">{filesize(printerData?.fs.total)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Used</TableCell>
                  <TableCell align="left">{filesize(printerData?.fs.used)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Free</TableCell>
                  <TableCell align="left">
                    {`${Math.max(0, ((printerData?.fs.maximages || 0) - (printerData?.dumps.length || 0)))} images`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">Images</TableCell>
                  <TableCell align="left">{printerData?.dumps.length}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : null
      }
    </Stack>
  );
}

export default PrinterReport;
