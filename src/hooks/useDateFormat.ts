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
    let dateObject = new Date(date);

    if (typeof date === 'string' && isNaN(dateObject.getTime())) {
      const fixed = date.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}):(\d{3})/, '$1T$2.$3');
      dateObject = new Date(fixed);
    }

    return format.dateTime(dateObject, 'short');
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
