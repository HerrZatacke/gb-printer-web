import type { RemoteEnv } from '../../types/Printer';

const getRemoteEnv = (): RemoteEnv => {
  const targetWindow: Window = window.opener || window.parent;
  const isIframe: boolean = targetWindow === window.parent && targetWindow !== window;
  const isPopup: boolean = targetWindow === window.opener && targetWindow !== window;
  const isRemote: boolean = isIframe || isPopup;

  return {
    targetWindow,
    isIframe,
    isPopup,
    isRemote,
  };
};

export default getRemoteEnv;
