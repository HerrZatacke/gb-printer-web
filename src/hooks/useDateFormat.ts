import dayjs from 'dayjs';
import { useCallback } from 'react';
import { dateFormat } from '@/consts/defaults';
import useSettingsStore from '@/stores/settingsStore';
import dateFormatLocale from '@/tools/dateFormatLocale';

interface UseDateFormat {
  formatter: (date: string) => string | null;
}

export const useDateFormat = (): UseDateFormat => {
  const {
    hideDates,
    preferredLocale,
  } = useSettingsStore();

  const formatter = useCallback((date: string) => {
    if (hideDates || !date) {
      return null;
    }

    return dateFormatLocale(dayjs(date, dateFormat), preferredLocale);
  }, [hideDates, preferredLocale]);

  return { formatter };
};
