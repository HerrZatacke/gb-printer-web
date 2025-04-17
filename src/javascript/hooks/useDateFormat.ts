import { useCallback } from 'react';
import dayjs from 'dayjs';
import useSettingsStore from '../app/stores/settingsStore';
import dateFormatLocale from '../tools/dateFormatLocale';
import { dateFormat } from '../app/defaults';

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
