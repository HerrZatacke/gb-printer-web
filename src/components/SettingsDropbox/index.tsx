'use client';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import Debug from '@/components/Debug';
import { useDropboxSettings } from '@/hooks/useDropboxSettings';
import cleanPath from '@/tools/cleanPath';

function SettingsDropbox() {
  const {
    use,
    loggedIn,
    logout,
    startAuth,
    setDropboxStorage,
    path: propsPath,
    autoDropboxSync,
    debugText,
  } = useDropboxSettings();
  const [path, setPath] = useState<string>(propsPath);
  const t = useTranslations('SettingsDropbox');
  const folderLink = `https://www.dropbox.com/home/Apps/GameBoyPrinter/${path}`;

  return (
    <Stack
      direction="column"
      gap={6}
    >
      <FormControlLabel
        label={t('enableStorage')}
        control={(
          <Switch
            checked={use}
            onChange={({ target }) => {
              setDropboxStorage({
                use: target.checked,
              });
            }}
          />
        )}
      />

      {
        !use ? null : (
          <>
            <TextField
              id="dropbox-settings-path"
              label={t('subfolder')}
              helperText={t.rich('openFolder', { link: (chunks) => (
                  <Link
                    title={t('openFolderLinkTitle', { folderLink })}
                    href={folderLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {chunks}
                  </Link>
                ),
              })}
              type="text"
              value={path}
              onChange={(ev) => {
                setPath(ev.target.value);
              }}
              onBlur={() => {
                setPath(cleanPath(path));
                setDropboxStorage({
                  path: cleanPath(path),
                });
              }}
            />

            <FormControlLabel
              label={(
                <>
                  {t('enableEnhancedSync')}
                  <Typography
                    variant="caption"
                    component="p"
                    color="error"
                  >
                    {t('enableEnhancedSyncHelper')}
                  </Typography>
                </>
              )}
              control={(
                <Switch
                  checked={autoDropboxSync}
                  onChange={({ target }) => {
                    setDropboxStorage({
                      autoDropboxSync: target.checked,
                    });

                    // refresh to start/stop polling in dropbox client
                    window.setTimeout(() => {
                      window.location.reload();
                    }, 300);
                  }}
                />
              )}
            />

            <ButtonGroup
              variant="contained"
              fullWidth
            >
              <Button
                disabled={loggedIn}
                onClick={startAuth}
              >
                {t('authenticate')}
              </Button>
              <Button
                disabled={!loggedIn}
                onClick={logout}
              >
                {t('logout')}
              </Button>
            </ButtonGroup>
          </>
        )
      }
      <Debug text={debugText}/>
    </Stack>
  );
}

export default SettingsDropbox;
