'use client';

import NextLink, { LinkProps } from 'next/link';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useMemo } from 'react';

export enum ExactMatchMode {
  PATH_STARTSWITH = 'PATH_STARTSWITH',
  EXACT_PATH = 'EXACT_PATH',
  EXACT_PATH_AND_SEARCH = 'EXACT_PATH_AND_SEARCH',
}

type Props = LinkProps &
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

const pathAndSearch = (pathName: string, searchParams: ReadonlyURLSearchParams): string => {
  const search = searchParams.toString();
  return search.length ? `${pathName}?${search}` : pathName;
};

const WrappedNextLink = React.forwardRef<HTMLAnchorElement, Props>(
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
    const searchParams = useSearchParams();

    const isActive = useMemo(() => {
      switch (exact) {
        case ExactMatchMode.PATH_STARTSWITH:
          return pathname.startsWith(normalize(String(href)));

        case ExactMatchMode.EXACT_PATH:
          return pathname === normalize(String(href));

        case ExactMatchMode.EXACT_PATH_AND_SEARCH:
        default:
          return pathAndSearch(pathname, searchParams) === String(href);
      }
    }, [exact, href, pathname, searchParams]);

    const combinedClassName = [
      className,
      isActive ? activeClassName : null,
    ]
      .filter(Boolean)
      .join(' ');

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
