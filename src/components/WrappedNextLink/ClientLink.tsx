'use client';

import NextLink from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useMemo } from 'react';
import {
  type WrappedNextLinkProps,
  calculateActive,
  ExactMatchMode,
} from '@/components/WrappedNextLink/common';


const ClientLink = React.forwardRef<HTMLAnchorElement, WrappedNextLinkProps>(
  function ClientLink(
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

export default ClientLink;
