import { ReadonlyURLSearchParams } from 'next/navigation';
import {
  type Dispatch,
  type SetStateAction,
  useState,
} from 'react';

export interface UseSearchParams {
  searchParams: ReadonlyURLSearchParams | null;
  setClientSearchParams: Dispatch<SetStateAction<ReadonlyURLSearchParams | null>>;
}

export const useContextHook = (): UseSearchParams => {
  const [searchParams, setClientSearchParams] = useState<ReadonlyURLSearchParams | null>(null);

  return {
    searchParams,
    setClientSearchParams,
  };
};
