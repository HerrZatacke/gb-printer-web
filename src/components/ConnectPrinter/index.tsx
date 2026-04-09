import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/stores';

function ConnectPrinter() {
  const t = useTranslations('ConnectPrinter');
  const { printerUrl } = useSettingsStore();
  const [printerWindow, setPrinterWindow] = useState<Window | null>(null);

  useEffect(() => {
    return () => printerWindow?.close();
  }, [printerWindow]);

  return (
    <ButtonGroup
      variant="contained"
      fullWidth
    >
      {printerWindow ? (
        <Button
          onClick={() => setPrinterWindow(null)}
        >
          {t('closePrinterPage')}
        </Button>
      ):(
        <Button
          onClick={() => {
            const newWindow = window.open(printerUrl, 'remoteprinter', 'width=480,height=400');
            setPrinterWindow((currentWindow) => {
              currentWindow?.close();
              return newWindow;
            });
          }}
        >
          {t('openPrinterPage')}
        </Button>
      )}
    </ButtonGroup>
  );
}

export default ConnectPrinter;
