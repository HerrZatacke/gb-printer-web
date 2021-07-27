import { useEffect, useRef } from 'react';

const useAutoFocus = () => {
  const ref = useRef();
  useEffect(() => {
    const lastFocussedElement = document.activeElement;

    const focusables = [
      ...ref.current.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'),
    ];

    if (focusables.length) {
      focusables[0].focus();
    }

    return () => {
      lastFocussedElement.focus();
    };
  });

  return ref;
};

export default useAutoFocus;
