import {
  Stack,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useCallback } from 'react';
import Lightbox from '@/components/Lightbox';
import { useInteractionsStore, useSettingsStore } from '@/stores/stores';

function RemoteStorageStatus() {
  const { setRemoteStorageStatus, remoteStorageStatus } = useInteractionsStore();
  const t = useTranslations('RemoteStorageStatus');
  const tsg = useTranslations('SettingsGeneric');
  // const { remoteStorageUrl, setRemoteStorageUrl } = useSettingsStore();
  // const [remoteStorageUrlState, setRemoteStorageUrlState] = useState<string>(remoteStorageUrl);
  // const [copyLocalToRemote, setCopyLocalToRemote] = useState<boolean>(true);
  // const [purgeRemote, setPurgeRemote] = useState<boolean>(false);

  // const { copyToRemote, progress } = useCopyToRemote();

  const remoteStorageIsAutomatic = process.env.NEXT_PUBLIC_AUTOMATIC_REMOTE_STORAGE === '1';
  const isError = remoteStorageStatus !== 'awaitingToken';
  const { setRemoteStorageUrl } = useSettingsStore();

  const confirm = useCallback(async () => {
    setRemoteStorageStatus(null);
  }, [setRemoteStorageStatus]);

  const deny = useCallback(() => {
    setRemoteStorageUrl('');
  }, [setRemoteStorageUrl]);

  if (!remoteStorageStatus) {
    return null;
  }

  return (
    <Lightbox
      confirm={confirm}
      confirmMessage={isError ? t('retry') : undefined}
      denyMessage={tsg('removeRemoteStorage')}
      canConfirm={isError}
      deny={remoteStorageIsAutomatic || !isError ? undefined : deny}
      header={isError ? t('errorHeader') : t('awaitingHeader')}
    >
      <Stack
        direction="column"
        sx={{
          gap: 2,
        }}
      >
        <p>{ t(remoteStorageStatus) }</p>
      </Stack>
    </Lightbox>
  );
}

export default RemoteStorageStatus;
