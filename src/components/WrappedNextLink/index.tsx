'use client';

import NextLink, { LinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { forwardRef, useEffect, useMemo } from 'react';
import { useClientSearchParams } from '@/contexts/SearchParamsContext';

declare global {
  interface Window {
    debugNext71365?: boolean;
  }
}

if (typeof window !== 'undefined') {
  window.debugNext71365 = false;
}

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
    const router = useRouter();
    const pathname = usePathname();
    const { searchParams } = useClientSearchParams();

    // https://github.com/vercel/next.js/issues/71365 can only be debugged in production
    // due to bad build results on windows
    // to debug set window.debugNext71365 to true via console
    useEffect(() => {
      const handle = window.setTimeout(() => {
        if (typeof href === 'string' && !window.debugNext71365) {
          router.prefetch(href);
        }
      }, 500 + (Math.random() * 500));

      return () => window.clearTimeout(handle);
    }, [href, router]);

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
        onClick={(ev) => {
          const onClick = rest.onClick;

          if (typeof onClick === 'function') {
            onClick(ev);
          }

          window.setTimeout(() => {
            if (typeof href === 'string') {
              if (!window.location.href.endsWith(href)) {
                console.log({
                  onClick,
                  href,
                  pathname,
                  searchParams,
                  searchParamsStringified: searchParams?.toString(),
                });
              }
            }
          }, 1000);
        }}
      />
    );
  },
);

export default WrappedNextLink;
