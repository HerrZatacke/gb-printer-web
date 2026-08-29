import {
  FormControlLabel,
  LinearProgress,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
import Lightbox from '@/components/Lightbox';
import { useCopyToRemote } from '@/components/Overlays/ConnectRemoteStorage/useCopyToRemote';
import { useInteractionsStore, useSettingsStore } from '@/stores/stores';
import cleanUrl from '@/tools/cleanUrl';

function ConnectRemoteStorage() {
  const { setShowRemoteStorageDialog } = useInteractionsStore();
  const t = useTranslations('ConnectRemoteStorage');
  const { remoteStorageUrl, setRemoteStorageUrl } = useSettingsStore();
  const [remoteStorageUrlState, setRemoteStorageUrlState] = useState<string>(remoteStorageUrl);
  const [copyLocalToRemote, setCopyLocalToRemote] = useState<boolean>(true);
  const [purgeRemote, setPurgeRemote] = useState<boolean>(false);

  const { copyToRemote, progress } = useCopyToRemote();

  const confirm = useCallback(async () => {
    if (copyLocalToRemote && remoteStorageUrlState) {
      await copyToRemote(remoteStorageUrlState, purgeRemote);
    }
    setRemoteStorageUrl(remoteStorageUrlState);
    // closing dialog not necessary, as page will refresh
  }, [copyLocalToRemote, setRemoteStorageUrl, remoteStorageUrlState, copyToRemote, purgeRemote]);

  const deny = useCallback(() => {
    setShowRemoteStorageDialog(false);
  }, [setShowRemoteStorageDialog]);

  return (
    <Lightbox
      confirm={confirm}
      canConfirm={Boolean(remoteStorageUrlState)}
      deny={deny}
      header={t('remoteStorageHeader')}
    >
      <Stack
        direction="column"
        sx={{
          gap: 2,
        }}
      >
        <TextField
          label={t('remoteStorageUrl')}
          type="text"
          helperText={t('remoteStorageUrlHelper')}
          value={remoteStorageUrlState}
          onChange={(ev) => setRemoteStorageUrlState(ev.target.value)}
          onBlur={async () => {
            const newValue = cleanUrl(remoteStorageUrlState, 'http');
            setRemoteStorageUrlState(newValue);
          }}
        />

        <FormControlLabel
          label={t('copyLocalToRemote')}
          control={(
            <Switch
              checked={copyLocalToRemote}
              onChange={({ target }) => {
                setCopyLocalToRemote(target.checked);
              }}
            />
          )}
        />

        <FormControlLabel
          label={t('purgeRemote')}
          disabled={!copyLocalToRemote}
          control={(
            <Switch
              checked={purgeRemote && copyLocalToRemote}
              onChange={({ target }) => {
                setPurgeRemote(target.checked);
              }}
            />
          )}
        />
        <LinearProgress
          variant="determinate"
          value={progress * 100}
        />
      </Stack>
    </Lightbox>
  );
}

export default ConnectRemoteStorage;
