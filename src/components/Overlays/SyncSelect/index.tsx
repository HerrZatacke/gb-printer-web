import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GitHubIcon from '@mui/icons-material/GitHub';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import React from 'react';
import Lightbox from '@/components/Lightbox';
import { StorageType, SyncDirection } from '@/consts/sync';
import { useSyncSelect } from '@/hooks/useSyncSelect';

const getButtonColor = (showSyncHints: boolean, warn: boolean): 'secondary' | 'error' => {
  if (!showSyncHints) {
    return 'secondary';
  }

  return warn ? 'error' : 'secondary';
};

function SyncSelect() {
  const t = useTranslations('SyncSelect');

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
      header={t('dialogHeader')}
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
              title={t('syncToGitHubTitle', { repoUrl })}
              onClick={() => {
                startSync(StorageType.GIT, SyncDirection.UP);
              }}
            >
              {t('syncToGitHub')}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<GitHubIcon />}
              endIcon={<CloudDownloadIcon />}
              title={t('syncFromGitHubTitle', { repoUrl })}
              onClick={() => {
                startSync(StorageType.GIT, SyncDirection.DOWN);
              }}
            >
              {t('syncFromGitHub')}
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
                title={t('syncToDropbox')}
                onClick={() => {
                  startSync(StorageType.DROPBOX, SyncDirection.UP);
                }}
              >
                {t('syncToDropbox')}
              </Button>
              {showSyncHints && syncLastUpdate.local < syncLastUpdate.dropbox && (
                <Typography variant="caption">
                  {t('pendingRemoteChangesWarning')}
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
                title={t('syncFromDropbox')}
                onClick={() => {
                  startSync(StorageType.DROPBOX, SyncDirection.DOWN);
                }}
              >
                {t('syncFromDropbox')}
              </Button>
              {showSyncHints && syncLastUpdate.local > syncLastUpdate.dropbox && (
                <Typography variant="caption">
                  {t('pendingLocalChangesWarning')}
                </Typography>
              )}
            </Stack>

            <Button
              variant="contained"
              color="secondary"
              endIcon={<CloudUploadIcon />}
              title={t('syncImagesToDropbox')}
              onClick={() => {
                startSync(StorageType.DROPBOXIMAGES, SyncDirection.UP);
              }}
            >
              {t('syncImagesToDropbox')}
            </Button>
          </Stack>
        )}
      </Stack>
    </Lightbox>
  );
}

export default SyncSelect;
