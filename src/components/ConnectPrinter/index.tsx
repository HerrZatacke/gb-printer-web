import {
  Button,
  ButtonGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PrinterReport from '@/components/PrinterReport';
import { DialoqQuestionType } from '@/consts/dialog';
import { useClientSearchParams } from '@/contexts/SearchParamsContext';
import { useDialogsStore, useInteractionsStore, useSettingsStore } from '@/stores/stores';
import cleanUrl from '@/tools/cleanUrl';

function ConnectPrinter() {
  const t = useTranslations('ConnectPrinter');
  const { printerUrls, setPrinterUrls } = useSettingsStore();
  const { setPrinterFunctions, setPrinterData } = useInteractionsStore();
  const { dismissDialog, setDialog } = useDialogsStore();
  const printerWindow = useRef<Window | null>(null);
  const [openedUrl, setOpenedUrl] = useState('');
  const { searchParams } = useClientSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const addPrinter = searchParams?.get('addPrinter') || null;

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

  const openPrinter = useCallback((printerUrl: string) => {
    printerWindow.current?.close();
    const newWindow = window.open(`${printerUrl}remote.html`, 'remoteprinter', 'width=480,height=400');
    printerWindow.current = newWindow;
    setOpenedUrl(printerUrl);
    setPrinterFunctions([]);
    setPrinterData(null);
  }, [setPrinterData, setPrinterFunctions]);

  const closePrinter = useCallback(() => {
    printerWindow.current?.close();
    setOpenedUrl('');
    setPrinterFunctions([]);
    setPrinterData(null);
  }, [setPrinterData, setPrinterFunctions]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (addPrinter) {
        const openPrinterUrl = cleanUrl(addPrinter, 'http');

        if (printerUrls.includes(openPrinterUrl)) {
          openPrinter(openPrinterUrl);
          router.replace(pathname);
        } else {
          console.log(openPrinterUrl);
          setDialog({
            message: t('askAddPrinterTitle'),
            questions: () => ([{
              type: DialoqQuestionType.INFO,
              label: t('askAddPrinterMessage', { openPrinterUrl }),
              key: 'message',
              severity: 'warning',
            }]),
            confirm: async () => {
              dismissDialog(0);
              router.replace(pathname);
              setPrinterUrls([...printerUrls, openPrinterUrl]);
              openPrinter(openPrinterUrl);
            },
            deny: async () => {
              dismissDialog(0);
              router.replace(pathname);
            },
          });
        }
      }
    }, 1);

    return () => window.clearTimeout(handle);
  }, [addPrinter, dismissDialog, openPrinter, pathname, printerUrls, router, setDialog, setPrinterUrls, t]);

  return (
    <Stack direction="column" gap={2}>
      {printerUrls.map((printerUrl, index) => (
        openedUrl === printerUrl ? (
          <PrinterReport key={`${printerUrl}-report-${index}`}>
            <Button onClick={closePrinter}>
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
              <Button onClick={() => openPrinter(printerUrl)}>
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
