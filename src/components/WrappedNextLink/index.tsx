'use client';

import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { type WrappedNextLinkProps } from '@/components/WrappedNextLink/common';

export const WrappedClientLink = dynamic(
  () => import('@/components/WrappedNextLink/ClientLink'),
  {
    ssr: false,
    loading: () => null,
  },
);

const WrappedNextLink = React.forwardRef<HTMLAnchorElement, WrappedNextLinkProps>(
  function WrappedNextLink(
    props,
    ref,
  ) {
    const {
      href,
      className,
      ...rest
    } = props;

    const [onClient, setOnClient] = useState(false);
    useEffect(() => {
      const handle = window.setTimeout(() => {
        setOnClient(true);
      }, 1);

      return () => window.clearTimeout(handle);
    }, []);

    if (onClient) {
      return <WrappedClientLink ref={ref} {...props} />;
    }

    return (
      <NextLink
        ref={ref}
        href={href}
        className={className}
        {...rest}
      />
    );
  },
);

export default WrappedNextLink;
