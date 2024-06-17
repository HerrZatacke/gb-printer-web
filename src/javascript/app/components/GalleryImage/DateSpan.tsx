import React from 'react';
import dayjs from 'dayjs';
import dateFormatLocale from '../../../tools/dateFormatLocale';
import { dateFormat } from '../../defaults';

interface Props {
  hideDate?: boolean
  created?: string,
  className?: string,
  preferredLocale?: string,
}

function DateSpan({ hideDate, created, className, preferredLocale }: Props) {
  if (hideDate || !created) {
    return null;
  }

  return (
    <span className={className}>
      { dateFormatLocale(dayjs(created, dateFormat), preferredLocale) }
    </span>
  );
}

export default DateSpan;
