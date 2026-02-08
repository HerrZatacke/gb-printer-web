import { useState } from 'react';
import useGapiSheetState from '@/contexts/GapiSheetStateContext';

export interface GapiSyncContextType {
  busy: boolean;
}

export const useContextHook = (): GapiSyncContextType => {
  const { } = useGapiSheetState();
  const [busy, setBusy] = useState(false);



  return {
    busy,
  };
};
