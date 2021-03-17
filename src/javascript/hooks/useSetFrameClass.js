import { useEffect } from 'react';

const useSetFrameClass = (targetWindow) => (
  useEffect(() => {

    const isIframe = targetWindow === window.parent;
    const isPopup = targetWindow === window.opener;

    const classList = document.querySelector('html').classList;
    if (isIframe) {
      classList.add('is-simple-iframe');
    }

    if (isPopup) {
      classList.add('is-simple-popup');
    }
  })
);

export default useSetFrameClass;
