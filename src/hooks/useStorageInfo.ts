import { useEffect, useState } from 'react';
import sortBy, { SortDirection } from '@/tools/sortby';

export interface Quota {
  type: string,
  total: number,
  used: number,
  percentage: number,
}

const sortByPercentage = sortBy<Quota>('percentage', SortDirection.DESC);

interface UseStorageInfo {
  storageEstimate: Quota,
}

const getLocalStorageUsage = (): number => {
  let totalSize = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        totalSize += key.length + value.length;
      }
    }
  }

  return totalSize;
};

const estimateLocalStorageMaxSize = (): number => {
  const testKey = '__test_localStorage_limit__';
  let low = 0;
  let high = 15 * 1024 * 1024; // Start with an assumption of 15MB
  let maxSize = 0;

  try {
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const testData = 'A'.repeat(mid);

      try {
        localStorage.setItem(testKey, testData);
        maxSize = mid;
        low = mid + 1;
      } catch {
        high = mid - 1;
      }
    }
  } finally {
    localStorage.removeItem(testKey);
  }

  return maxSize;
};

export const useStorageInfo = (): UseStorageInfo => {
  const [storageEstimate, setStorageEstimate] = useState<Quota[]>([]);

  useEffect(() => {
    window.setTimeout(async () => {
      const estimate: StorageEstimate | null = await navigator.storage?.estimate() || null;

      const used = getLocalStorageUsage();
      const total = used + estimateLocalStorageMaxSize();

      setStorageEstimate([
        {
          type: 'indexedDB',
          total,
          used,
          percentage: Math.ceil(used / total * 100),
        },
        {
          type: 'localStorage',
          total: estimate?.quota || 0,
          used: estimate?.usage || 0,
          percentage: Math.ceil(total ? (estimate?.usage || 0) / (estimate?.quota || 1) * 100 : 100),
        },
      ]);
    }, 10);
  }, []);

  return {
    storageEstimate: sortByPercentage(storageEstimate.filter(({ percentage }) => (percentage > 75)))[0] || null,
  };
};
