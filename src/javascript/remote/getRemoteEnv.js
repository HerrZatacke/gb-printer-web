const getRemoteEnv = () => {
  const targetWindow = window.opener || window.parent;
  const isIframe = targetWindow === window.parent && targetWindow !== window;
  const isPopup = targetWindow === window.opener && targetWindow !== window;
  const isRemote = isIframe || isPopup;

  return {
    targetWindow,
    isIframe,
    isPopup,
    isRemote,
  };
};

export default getRemoteEnv;
