import { SortDirection } from 'gb-printer-schemas';
import { useEffect, useState } from 'react';
import sortBy from '@/tools/sortby';

export interface Quota {
  type: string;
  total: number;
  used: number;
  percentage: number;
}

interface LocalStorageUsageItem {
  key: string;
  size: number;
}

interface LocalStorageUsage {
  items: LocalStorageUsageItem[];
  totalSize: number;
}

interface UseStorageInfo {
  criticalStorageEstimate: Quota | null;
  storageEstimate: Quota[];
  localStorageUsageItems: LocalStorageUsageItem[];
}

const sortByPercentage = sortBy<Quota>('percentage', SortDirection.DESC);

const getLocalStorageUsage = (): LocalStorageUsage => {
  let totalSize = 0;
  const items: LocalStorageUsageItem[] = [];
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        const size = key.length + value.length;
        totalSize += size;
        items.push({ key, size });
      }
    }
  }

  return {
    items,
    totalSize,
  };
};

const estimateLocalStorageAvailableSize = (): number => {
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
  const [localStorageUsageItems, setLocalStorageUsageItems] = useState<LocalStorageUsageItem[]>([]);

  useEffect(() => {
    window.setTimeout(async () => {
      const estimate: StorageEstimate | null = await navigator.storage?.estimate() || null;

      const { totalSize: used, items } = getLocalStorageUsage();
      const total = used + estimateLocalStorageAvailableSize();

      setLocalStorageUsageItems(items);

      setStorageEstimate([
        {
          type: 'localStorage',
          total,
          used,
          percentage: used / total * 100,
        },
        {
          type: 'indexedDB',
          total: estimate?.quota || 0,
          used: estimate?.usage || 0,
          percentage: total ? (estimate?.usage || 0) / (estimate?.quota || 1) * 100 : 100,
        },
      ]);

    }, 10);
  }, []);

  return {
    criticalStorageEstimate: sortByPercentage(storageEstimate.filter(({ percentage }) => (percentage > 75)))[0] || null,
    storageEstimate,
    localStorageUsageItems,
  };
};
