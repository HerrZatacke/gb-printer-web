import {
  Button,
  ButtonGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import PrinterReport from '@/components/PrinterReport';
import { useInteractionsStore, useSettingsStore } from '@/stores/stores';

function ConnectPrinter() {
  const t = useTranslations('ConnectPrinter');
  const { printerUrls } = useSettingsStore();
  const { setPrinterFunctions, setPrinterData } = useInteractionsStore();
  const printerWindow = useRef<Window | null>(null);
  const [openedUrl, setOpenedUrl] = useState('');

  useEffect(() => {
    const handle = window.setInterval(() => {
      if (!printerWindow.current || printerWindow.current.closed) {
        printerWindow.current = null;
        setOpenedUrl('');
        setPrinterFunctions([]);
        setPrinterData(null);
      }
    }, 500);

    return () => {
      printerWindow.current?.close();
      window.clearInterval(handle);
    };
  }, [setPrinterFunctions, setPrinterData]);

  return (
    <Stack direction="column" gap={2}>
      {printerUrls.map((printerUrl, index) => (
        openedUrl === printerUrl ? (
          <PrinterReport key={`${printerUrl}-report-${index}`}>
            <Button
              onClick={() => {
                printerWindow.current?.close();
                setOpenedUrl('');
                setPrinterFunctions([]);
                setPrinterData(null);
              }}
            >
              {t('closePrinterPage')}
            </Button>
          </PrinterReport>
        ):(
          <Stack
            key={`${printerUrl}-button-${index}`}
            direction="row"
            gap={4}
            alignItems="center"
          >
            <Typography variant="body2">
              {printerUrl}
            </Typography>
            <ButtonGroup
              variant="contained"
              fullWidth
            >
              <Button
                onClick={() => {
                  printerWindow.current?.close();
                  const newWindow = window.open(`${printerUrl}remote.html`, 'remoteprinter', 'width=480,height=400');
                  printerWindow.current = newWindow;
                  setOpenedUrl(printerUrl);
                  setPrinterFunctions([]);
                  setPrinterData(null);
                }}
              >
                {t('openPrinterPage')}
              </Button>
            </ButtonGroup>
          </Stack>
        )
      ))}
    </Stack>
  );
}

export default ConnectPrinter;
