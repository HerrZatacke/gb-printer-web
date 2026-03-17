import { useCallback } from 'react';
import useDownload from '@/hooks/useDownload';

interface UseSSTV {
  sstv: (hash: string) => Promise<void>;
}

export const useSSTV = (): UseSSTV => {

  const { prepareDownloadInfo } = useDownload();

  const sstv = useCallback(async (hash: string) => {
    const info = await prepareDownloadInfo(hash);
    console.log(info);
  }, [prepareDownloadInfo]);

  return { sstv };
};
