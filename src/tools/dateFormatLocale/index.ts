import type { Dayjs } from 'dayjs';

const options: Intl.DateTimeFormatOptions = { weekday: undefined, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };

const dateFormatLocale = (dayjsInstance: Dayjs, preferredLocale: Intl.LocalesArgument) => {
  const jsDate: Date = dayjsInstance.toDate();
  return jsDate.toLocaleString(preferredLocale, options);
};

export default dateFormatLocale;
