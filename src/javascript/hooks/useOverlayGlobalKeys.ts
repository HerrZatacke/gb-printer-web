import { useEffect } from 'react';

export interface OverlayGlobalKeysParams {
  confirm?: () => void,
  canConfirm: boolean,
  deny?: () => void,
}

const useOverlayGlobalKeys = ({
  confirm,
  canConfirm,
  deny,
}: OverlayGlobalKeysParams): void => {
  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        if (deny) {
          deny();
        }
      }

      if (ev.key === 'Enter' && ev.ctrlKey) {
        if (confirm && canConfirm) {
          confirm();
        }
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [confirm, canConfirm, deny]);
};

export default useOverlayGlobalKeys;
