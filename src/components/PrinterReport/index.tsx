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
import { filesize } from 'filesize';
import { useTranslations } from 'next-intl';
import React, { PropsWithChildren, useMemo } from 'react';
import { PrinterFunction } from '@/consts/printerFunction';
import { useRemotePrinterContext } from '@/contexts/RemotePrinterContext';
import { useInteractionsStore } from '@/stores/stores';

const functionTranslationKeys: Record<PrinterFunction, string> = {
  checkPrinter: 'functions.checkPrinter',
  fetchImages: '',
  clearPrinter: 'functions.clearPrinter',
};

function PrinterReport({ children }: PropsWithChildren) {
  const t = useTranslations('PrinterReport');
  const { printerData, printerFunctions, printerBusy } = useInteractionsStore();
  const { callRemoteFunction } = useRemotePrinterContext();

  const fetchImagesLabel = useMemo((): string => {
    const dumpsLength = printerData?.dumps?.length || 0;
    if (!dumpsLength) {
      return t('functions.fetchImagesGeneric');
    }

    return t('functions.fetchImagesCount', { count: dumpsLength });
  }, [printerData?.dumps?.length, t]);

  return (
    <Stack direction="column" gap={2}>
      <ButtonGroup
        variant="contained"
        fullWidth
      >
        {printerFunctions.length ? (
          printerFunctions.map((name) => (
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
                  fetchImagesLabel :
                  t(functionTranslationKeys[name as PrinterFunction])
              }
            </Button>
          ))
        ) : (
          <Button loading />
        )}
        {children}
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
                  <TableCell align="right">{t('printerFilesystem')}</TableCell>
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="right">{t('total')}</TableCell>
                  <TableCell align="left">{filesize(printerData?.fs.total)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">{t('used')}</TableCell>
                  <TableCell align="left">{filesize(printerData?.fs.used)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">{t('free')}</TableCell>
                  <TableCell align="left">
                    {t('freeImages', { count: Math.max(0, ((printerData?.fs.maximages || 0) - (printerData?.dumps.length || 0))) })}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">{t('images')}</TableCell>
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
