'use client';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
import WrappedNextLink from '@/components/WrappedNextLink';
import { useSettingsStore } from '@/stores/stores';
import cleanUrl from '@/tools/cleanUrl';

function SettingsPrinterUrls() {
  const t = useTranslations('SettingsPrinterUrls');
  const { printerUrls, setPrinterUrls } = useSettingsStore();

  const [printerUrlsState, setPrinterUrlsState] = useState<string[]>(printerUrls.length ? printerUrls : ['']);

  const updateState = useCallback((newUrl: string, index: number) => {
    setPrinterUrlsState((currentUrls) => {
      if (index + 1 > currentUrls.length) {
        return currentUrls;
      }

      const newUrls = [...currentUrls];
      newUrls[index] = newUrl;

      return newUrls;
    });
  }, []);

  const removeItem = useCallback((removeIndex: number) => {
    const filteredUrls = printerUrlsState.filter((_, i) => (i !== removeIndex));
    setPrinterUrlsState(filteredUrls);
    setPrinterUrls(filteredUrls.filter(Boolean));
  }, [printerUrlsState, setPrinterUrls]);

  const updateStore = useCallback(() => {
    const cleanedUrls = printerUrlsState.map((url) => cleanUrl(url, 'http'));
    setPrinterUrlsState(cleanedUrls);
    setPrinterUrls(cleanedUrls.filter(Boolean));
  }, [printerUrlsState, setPrinterUrls]);

  return (
    <Stack
      direction="column"
      gap={2}
    >
      <Stack direction="column" gap={1}>
        <Typography variant="h3">
          {t('printerUrls')}
        </Typography>
        <Typography variant="caption">
          {
            t.rich('printerUrlHelper', {
              link: (chunks) => (
                <Link
                  component={WrappedNextLink}
                  href="/import"
                  prefetch={false}
                >
                  {chunks}
                </Link>
              ),
            })
          }
        </Typography>
      </Stack>

      <Stack
        direction="column"
        gap={4}
      >
        {printerUrlsState.map((printerUrl, index) => (
          <TextField
            key={`printerUrl-${index}`}
            label={t('printerUrl')}
            type="text"
            value={printerUrl}
            onChange={(ev) => {
              updateState(ev.target.value, index);
            }}
            onBlur={updateStore}
            onKeyUp={(ev) => {
              switch (ev.key) {
                case 'Enter': {
                  updateStore();
                  break;
                }

                case 'Escape':
                  updateState(printerUrls[index] || '', index);
                  break;
                default:
              }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => removeItem(index)}
                      edge="end"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        ))}
      </Stack>
      <Stack alignItems="flex-end">
        <Button
          variant="outlined"
          color="secondary"
          title={t('addPrinter')}
          onClick={() => {
            setPrinterUrlsState((currentUrls) => ([...currentUrls, '']));
          }}
          startIcon={<AddIcon/>}
        >
          {t('addPrinter')}
        </Button>
      </Stack>
    </Stack>
  );
}

export default SettingsPrinterUrls;
