'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface UseUrl {
  fullPath: string;
  pathname: string;
  searchParams: URLSearchParams;
  query: string;
}

export const useUrl = (): UseUrl => {
  const pathname = usePathname();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams());

  useEffect(() => {
    const updateSearchParams = () => {
      window.setTimeout(() => {
        const newParams = new URLSearchParams(window.location.search);
        if (newParams)
        setSearchParams((current) => (
          newParams.toString() !== current.toString() ? newParams: current
        ));
      }, 1);
    };

    updateSearchParams();

    // Listen to popstate (back/forward)
    window.addEventListener('popstate', updateSearchParams);

    // Listen to pushState/replaceState (manually triggered route changes)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      updateSearchParams();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      updateSearchParams();
    };

    return () => {
      window.removeEventListener('popstate', updateSearchParams);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [pathname]);

  const query = useMemo(() => searchParams.toString(), [searchParams]);

  const fullPath = useMemo(() => {
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, query]);

  return {
    fullPath,
    pathname,
    query,
    searchParams,
  };
};
