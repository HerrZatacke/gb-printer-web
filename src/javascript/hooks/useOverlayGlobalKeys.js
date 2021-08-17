import { useEffect } from 'react';

const useOverlayGlobalKeys = ({
  confirm = null,
  canConfirm = null,
  deny = null,
}) => {
  useEffect(() => {
    const listener = (ev) => {
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
