'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef } from 'react';
import useFileDrop from '@/hooks/useFileDrop';
import { useHandleHashParams } from '@/hooks/useHandleHashParams';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import { useStores } from '@/hooks/useStores';
import useTrashbin from '@/hooks/useTrashbin';
import { trashCheckKeys } from '@/stores/items/queries/cacheKeys';
import { dropboxStorageTool } from '@/tools/dropboxStorage';

// if (typeof window !== 'undefined') {
//   import('@/tools/generateDebugImages')
//     .then(({ generateDebugImages }) => {
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-expect-error
//       window.generateDebugImages = generateDebugImages;
//     });
// }

function GlobalAppInit({ children }: PropsWithChildren) {
  useFileDrop();
  useHandleHashParams();

  const router = useRouter();
  const queryClient = useQueryClient();
  const isCleanupCheckRunningRef = useRef(false);
  const cleanupCheckTimeoutRef = useRef<number | null>(null);
  const { checkUpdateTrashCount } = useTrashbin();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.nextRouter = router;
  }, [router]);

  const stores = useStores();
  const { remoteImport } = useImportExportSettings();

  useEffect(() => {
    const { subscribe } = dropboxStorageTool(stores, remoteImport);
    // gitStorageTool(remoteImport);

    return subscribe();
  }, [remoteImport, stores]);

  useEffect(() => {
    const runCleanupCheck = async () => {
      if (isCleanupCheckRunningRef.current) {
        return;
      }

      isCleanupCheckRunningRef.current = true;

      try {
        await checkUpdateTrashCount();
      } finally {
        isCleanupCheckRunningRef.current = false;
      }
    };

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type !== 'updated' || event.action.type !== 'success') {
        return;
      }

      if (isCleanupCheckRunningRef.current) {
        return;
      }

      const matches = trashCheckKeys.some((key) => {

        if (event.query.queryKey.length < key.length) {
          return false;
        }

        return key.every((segment: string, index: number) => (
          segment === event.query.queryKey[index]
        ));
      });

      if (!matches) {
        return;
      }

      if (cleanupCheckTimeoutRef.current) {
        window.clearTimeout(cleanupCheckTimeoutRef.current);
      }

      cleanupCheckTimeoutRef.current = window.setTimeout(runCleanupCheck, 5000);
    });

    return () => {
      unsubscribe();

      if (cleanupCheckTimeoutRef.current) {
        window.clearTimeout(cleanupCheckTimeoutRef.current);
      }
    };
  }, [checkUpdateTrashCount, queryClient]);

  return children;
}

export default GlobalAppInit;
