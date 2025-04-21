import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Lightbox from '../../Lightbox';
import { useSyncSelect } from './useSyncSelect';

const getButtonColor = (showSyncHints: boolean, warn: boolean): 'secondary' | 'error' => {
  if (!showSyncHints) {
    return 'secondary';
  }

  return warn ? 'error' : 'secondary';
};

function SyncSelect() {
  const {
    repoUrl,
    dropboxActive,
    gitActive,
    syncLastUpdate,
    autoDropboxSync,
    startSync,
    cancelSync,
  } = useSyncSelect();

  const showSyncHints = autoDropboxSync && (syncLastUpdate.local !== syncLastUpdate.dropbox);

  return (
    <Lightbox
      deny={cancelSync}
      header="Synchronize"
    >
      <Stack
        direction="column"
        gap={4}
        sx={{ '& .MuiButton-endIcon svg': { fontSize: 32 } }}
      >
        {gitActive && (
          <Stack
            direction="column"
            gap={2}
          >
            <Button
              variant="contained"
              color="secondary"
              startIcon={<GitHubIcon />}
              endIcon={<CloudUploadIcon />}
              title={`Synchronize to GitHub\n${repoUrl}`}
              onClick={() => {
                startSync('git', 'up');
              }}
            >
              Synchronize to GitHub
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<GitHubIcon />}
              endIcon={<CloudDownloadIcon />}
              title={`Synchronize from GitHub\n${repoUrl}`}
              onClick={() => {
                startSync('git', 'down');
              }}
            >
              Synchronize from GitHub
            </Button>
          </Stack>
        )}
        {dropboxActive && (
          <Stack
            direction="column"
            gap={2}
          >
            <Stack
              direction="column"
              gap={1}
            >
              <Button
                variant="contained"
                color={getButtonColor(showSyncHints, syncLastUpdate.local < syncLastUpdate.dropbox)}
                endIcon={<CloudUploadIcon />}
                title="Synchronize to Dropbox"
                onClick={() => {
                  startSync('dropbox', 'up');
                }}
              >
                Synchronize to Dropbox
              </Button>
              {showSyncHints && syncLastUpdate.local < syncLastUpdate.dropbox && (
                <Typography variant="caption">
                  There are pending remote changes. If you synchronize to dropbox now, these will be lost.
                </Typography>
              )}
            </Stack>

            <Stack
              direction="column"
              gap={1}
            >
              <Button
                variant="contained"
                color={getButtonColor(showSyncHints, syncLastUpdate.local > syncLastUpdate.dropbox)}
                endIcon={<CloudDownloadIcon />}
                title="Synchronize from Dropbox"
                onClick={() => {
                  startSync('dropbox', 'down');
                }}
              >
                Synchronize from Dropbox
              </Button>
              {showSyncHints && syncLastUpdate.local > syncLastUpdate.dropbox && (
                <Typography variant="caption">
                  There are local changes not synched to dropbox yet.
                  If you synchronize from dropbox now, these will be lost.
                </Typography>
              )}
            </Stack>

            <Button
              variant="contained"
              color="secondary"
              endIcon={<CloudUploadIcon />}
              title="Synchronize images to Dropbox"
              onClick={() => {
                startSync('dropboximages', 'up');
              }}
            >
              Synchronize images to Dropbox
            </Button>
          </Stack>
        )}
      </Stack>
    </Lightbox>
  );
}

export default SyncSelect;
