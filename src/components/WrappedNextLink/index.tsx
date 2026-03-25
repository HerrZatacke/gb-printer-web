'use client';

import NextLink, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { useMemo } from 'react';

type Props = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  activeClassName?: string;
  exact?: boolean;
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
    { href, activeClassName = 'active', exact = true, className, ...rest },
    ref,
  ) {
    const pathname = usePathname();

    const isActive = useMemo(() => {
      const normalizedPathname = normalize(pathname);
      const normalizedHref = normalize(String(href));

      return exact ? normalizedPathname === normalizedHref : normalizedPathname.startsWith(normalizedHref);
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
