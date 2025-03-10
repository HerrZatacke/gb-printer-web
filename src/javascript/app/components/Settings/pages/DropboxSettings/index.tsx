import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import cleanPath from '../../../../../tools/cleanPath';
import { useDropboxSettings } from './useDropboxSettings';
import { textFieldSlotDefaults } from '../../../../../consts/textFieldSlotDefaults';

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            color="tertiary"
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
              fullWidth
              size="small"
              value={path}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                ...textFieldSlotDefaults,
              }}
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
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  color="tertiary"
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
