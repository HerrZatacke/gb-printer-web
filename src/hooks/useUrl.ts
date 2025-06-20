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
  const [windowLocationSearch, setWindowLocationSearch] = useState<string>(typeof window !== 'undefined' ? window.location.search : '');

  const searchParams = useMemo(() => (
    new URLSearchParams(windowLocationSearch)
  ), [windowLocationSearch]);

  useEffect(() => {
    const updateSearchParams = () => {
      window.setTimeout(() => {
        setWindowLocationSearch((current) => (
          window.location.search !== current ? window.location.search : current
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
  }, [searchParams, pathname]);

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
