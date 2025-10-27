'use client';

import { PropsWithChildren, useEffect } from 'react';
import useFileDrop from '@/hooks/useFileDrop';
import { useHandleHashParams } from '@/hooks/useHandleHashParams';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import { useStores } from '@/hooks/useStores';
import useTrashbin from '@/hooks/useTrashbin';
import { dropboxStorageTool } from '@/tools/dropboxStorage';

function GlobalAppInit({ children }: PropsWithChildren) {
  useFileDrop();
  useHandleHashParams();

  const stores = useStores();
  const { remoteImport } = useImportExportSettings();

  useEffect(() => {
    const { subscribe } = dropboxStorageTool(stores, remoteImport);
    // gitStorageTool(remoteImport);

    return subscribe();
  }, [remoteImport, stores]);

  const { checkUpdateTrashCount } = useTrashbin();
  useEffect(() => {
    const handle = window.setTimeout(() => {
      checkUpdateTrashCount();
    }, 5000); // 5000ms to let store hydration happen.

    return () => window.clearTimeout(handle);
  }, [checkUpdateTrashCount]);

  return children;
}

export default GlobalAppInit;
