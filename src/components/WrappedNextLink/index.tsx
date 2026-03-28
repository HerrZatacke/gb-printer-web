'use client';

import NextLink, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef, useMemo } from 'react';
import { useClientSearchParams } from '@/contexts/SearchParamsContext';

export enum ExactMatchMode {
  PATH_STARTSWITH = 'PATH_STARTSWITH',
  EXACT_PATH = 'EXACT_PATH',
  EXACT_PATH_AND_SEARCH = 'EXACT_PATH_AND_SEARCH',
}

export type WrappedNextLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  activeClassName?: string;
  exact?: ExactMatchMode;
};

const normalize = (url: string): string => {
  try {
    return new URL(url, window.location.origin).pathname;
  } catch {
    return url;
  }
};

const pathAndSearch = (pathName: string, searchParams: URLSearchParams | null): string => {
  const search = searchParams?.toString() || '';
  return search.length ? `${pathName}?${search}` : pathName;
};

export const calculateActive = (exact: ExactMatchMode, pathname: string, href: string, searchParams: URLSearchParams | null) => {
  switch (exact) {
    case ExactMatchMode.PATH_STARTSWITH:
      return pathname.startsWith(normalize(href));

    case ExactMatchMode.EXACT_PATH:
      return pathname === normalize(href);

    case ExactMatchMode.EXACT_PATH_AND_SEARCH:
    default:
      return pathAndSearch(pathname, searchParams) === href;
  }
};

const WrappedNextLink = forwardRef<HTMLAnchorElement, WrappedNextLinkProps>(
  function WrappedNextLink(
    {
      href,
      activeClassName = 'active',
      exact = ExactMatchMode.PATH_STARTSWITH,
      className,
      ...rest
    },
    ref,
  ) {
    const pathname = usePathname();
    const { searchParams } = useClientSearchParams();

    const combinedClassName = useMemo(() => (
      [
        className,
        calculateActive(exact, pathname, String(href), searchParams) ? activeClassName : null,
      ]
        .filter(Boolean)
        .join(' ')
    ), [className, exact, pathname, href, activeClassName, searchParams]);

    return (
      <NextLink
        ref={ref}
        href={href}
        className={combinedClassName}
        {...rest}
      />
    );
  },
);

export default WrappedNextLink;
