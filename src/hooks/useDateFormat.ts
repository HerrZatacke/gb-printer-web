import { useFormatter } from 'next-intl';
import { useCallback } from 'react';
import useSettingsStore from '@/stores/settingsStore';

interface UseDateFormat {
  formatterGallery: (date: string) => string | null;
  formatter: (date: number |string | Date) => string;
}

export const useDateFormat = (): UseDateFormat => {
  const { hideDates } = useSettingsStore();

  const format = useFormatter();

  const formatter = useCallback((date: number | string | Date) => {
    return format.dateTime(new Date(date), 'short');
  }, [format]);

  const formatterGallery = useCallback((date: string) => {
    if (hideDates || !date) {
      return null;
    }

    return formatter(date);
  }, [formatter, hideDates]);

  return {
    formatterGallery,
    formatter,
  };
};
