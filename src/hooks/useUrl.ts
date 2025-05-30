import { type ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface UseUrl {
  fullPath: string,
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  query: string,
}

export const useUrl = (): UseUrl => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(() => (
    searchParams.toString()
  ), [searchParams]);

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
