import { useFormatter } from 'next-intl';
import { useCallback } from 'react';
import { useSettingsStore } from '@/stores/stores';
import { Date } from '@/tools/safeDate';
import { fromCreationDate } from '@/tools/toCreationDate';

interface UseDateFormat {
  formatterGallery: (date: string) => string | null;
  formatter: (date: number |string | Date) => string;
}

export const useDateFormat = (): UseDateFormat => {
  const { hideDates } = useSettingsStore();

  const format = useFormatter();

  const formatter = useCallback((date: number | string | Date): string => {
    let dateObject: Date;

    switch(typeof date) {
      case 'number':
        dateObject = new Date(date);
        break;
      case 'undefined': // Fallback for legacy images without creation date
        dateObject = new Date();
        break;
      case 'string':
        dateObject = fromCreationDate(date);
        break;
      default:
        dateObject = date;
    }

    if (isNaN(dateObject.getTime())) {
      return '';
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
