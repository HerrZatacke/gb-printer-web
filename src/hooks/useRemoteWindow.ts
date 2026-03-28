import { useEffect, useState } from 'react';
import { useEnv } from '@/contexts/EnvContext';
import { useUrl } from '@/hooks/useUrl';
import initCommands from '@/tools/remote/initCommands';
import startHeartbeat from '@/tools/remote/startHeartbeat';
import { RemoteEnv } from '@/types/Printer';

export enum ParentType {
  NONE = 'none',
  IFRAME = 'iframe',
  POPUP = 'popup',
}

interface UseRemoteWindow {
  parentType: ParentType,
}

export const useRemoteWindow = (): UseRemoteWindow => {
  const [parentType, setParentType] = useState<ParentType>(ParentType.NONE);
  const envData = useEnv();
  const { searchParams } = useUrl();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let cleanup = () => {};

    const handle = window.setTimeout(() => {
      const targetWindow: Window = window.opener || window.parent;
      const isIframe: boolean = targetWindow === window.parent && targetWindow !== window;
      const isPopup: boolean = targetWindow === window.opener && targetWindow !== window;
      const isRemote: boolean = isIframe || isPopup;

      const remoteEnv: RemoteEnv = { targetWindow, isIframe, isPopup, isRemote };

      if (isIframe) {
        setParentType(ParentType.IFRAME);
      } else if (isPopup) {
        setParentType(ParentType.POPUP);
      } else {
        setParentType(ParentType.NONE);
      }

      // Initialize remote communication
      const commands = envData?.env ? initCommands(remoteEnv, envData.env, searchParams) : [];
      cleanup = startHeartbeat(remoteEnv, commands.map(({ name }) => name));
    }, 1);

    return () => {
      window.clearTimeout(handle);
      cleanup();
    };
  }, [envData, searchParams]);

  return {
    parentType,
  };
};
