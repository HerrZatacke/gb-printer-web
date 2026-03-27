'use client';

import NextLink, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { useMemo } from 'react';

export enum ExactMatchMode {
  EXACT_STARTSWITH = 'EXACT_STARTSWITH',
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

const WrappedNextLink = React.forwardRef<HTMLAnchorElement, Props>(
  function WrappedNextLink(
    {
      href,
      activeClassName = 'active',
      exact = ExactMatchMode.EXACT_STARTSWITH,
      className,
      ...rest
    },
    ref,
  ) {
    const pathname = usePathname();

    const isActive = useMemo(() => {

      switch (exact) {
        case ExactMatchMode.EXACT_STARTSWITH:
          return normalize(pathname).startsWith(normalize(String(href)));

        case ExactMatchMode.EXACT_PATH:
          return normalize(pathname) === normalize(String(href));

        case ExactMatchMode.EXACT_PATH_AND_SEARCH:
        default:
          return pathname === String(href);
      }
    }, [exact, href, pathname]);

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
