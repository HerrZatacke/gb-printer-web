'use client';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useDropboxSettings } from '@/hooks/useDropboxSettings';
import cleanPath from '@/tools/cleanPath';

function DropboxSettings() {
  const {
    use,
    loggedIn,
    logout,
    startAuth,
    setDropboxStorage,
    path: propsPath,
    autoDropboxSync,
  } = useDropboxSettings();
  const [path, setPath] = useState<string>(propsPath);

  return (
    <Stack
      direction="column"
      gap={6}
    >
      <FormControlLabel
        label="Use Dropbox as storage"
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
              label="Subfolder"
              helperText={(
                <Link
                  title={`Open Dropbox folder:\nhttps://www.dropbox.com/home/Apps/GameBoyPrinter/${path}`}
                  href={`https://www.dropbox.com/home/Apps/GameBoyPrinter/${path}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  open folder
                </Link>
              )}
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
                  Enable enhanced dropbox sync
                  <Typography
                    variant="caption"
                    component="p"
                    color="error"
                  >
                    This is an experimental feature.
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

                    // Temporary refresh to start/stop polling in dropbox client
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
                Authenticate
              </Button>
              <Button
                disabled={!loggedIn}
                onClick={logout}
              >
                Logout
              </Button>
            </ButtonGroup>
          </>
        )
      }
    </Stack>
  );
}

export default DropboxSettings;
