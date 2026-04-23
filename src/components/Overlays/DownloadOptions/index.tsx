import Stack from '@mui/material/Stack';
import { useTranslations } from 'next-intl';
import React from 'react';
import Lightbox from '@/components/Lightbox';
import DownloadOptionsForm from '@/components/Overlays/DownloadOptions/DownloadOptionsForm';
import useDownload from '@/hooks/useDownload';
import { useDownloadInfo } from '@/hooks/useDownloadInfo';
import { useInteractionsStore } from '@/stores/stores';

function DownloadOptions() {
  const t = useTranslations('DownloadOptions');
  const { downloadHashes, setDownloadHashes } = useInteractionsStore();
  const { downloadImages } = useDownload();
  const { downloadTotal } = useDownloadInfo();

  return (
    <Lightbox
      header={t('dialogHeader', { count: downloadHashes.length })}
      confirm={() => {
        downloadImages(downloadHashes);
        setDownloadHashes([]);
      }}
      deny={() => setDownloadHashes([])}
      canConfirm={downloadTotal > 0}
    >
      <Stack
        direction="column"
        gap={4}
      >
        <DownloadOptionsForm inDialog />
      </Stack>
    </Lightbox>
  );
}

export default DownloadOptions;
