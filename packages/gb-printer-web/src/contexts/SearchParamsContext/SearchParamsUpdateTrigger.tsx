'use client';

import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import { type Dispatch, type SetStateAction, useEffect } from 'react';

interface Props {
  setClientSearchParams: Dispatch<SetStateAction<ReadonlyURLSearchParams | null>>;
}

export function SearchParamsUpdateTrigger({ setClientSearchParams }: Props) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setClientSearchParams(searchParams);
    }, 1);

    return () => window.clearTimeout(handle);
  }, [searchParams, setClientSearchParams]);

  // empty component
  return null;
}

export default SearchParamsUpdateTrigger;
