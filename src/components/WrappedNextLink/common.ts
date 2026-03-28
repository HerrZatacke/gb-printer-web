import { LinkProps } from 'next/link';
import * as React from 'react';

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

const pathAndSearch = (pathName: string, searchParams?: URLSearchParams): string => {
  const search = searchParams?.toString() || '';
  return search.length ? `${pathName}?${search}` : pathName;
};

export const calculateActive = (exact: ExactMatchMode, pathname: string, href: string, searchParams?: URLSearchParams) => {
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
