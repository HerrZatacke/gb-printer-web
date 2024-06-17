import { useState } from 'react';
import dayjs from 'dayjs';
import { dateFormatInput, timeFormatInput, dateFormat } from '../app/defaults';


export interface UseDateTime {
  date: string,
  time: string,
  setDate: (date: string) => void,
  setTime: (time: string) => void,
  updateDate: (date: string) => void,
  updateTime: (time: string) => void,
}

const useDateTime = (updateCreated: (value: string) => void, created?: string): UseDateTime => {

  const dateObject = dayjs(created);
  const [date, setDate] = useState(created ? dateObject.format(dateFormatInput) : '');
  const [time, setTime] = useState(created ? dateObject.format(timeFormatInput) : '');

  const updateDate = (value: string) => {
    const [y, m, d] = value.split('-');

    const year = parseInt(y, 10);
    const month = parseInt(m, 10);
    const day = parseInt(d, 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      setDate(dateObject.format(dateFormatInput));
      return;
    }

    const newDate = dayjs(created)
      .date(day)
      .month(month - 1)
      .year(year);
    updateCreated(newDate.format(dateFormat));
  };

  const updateTime = (value: string) => {
    const [h, m] = value.split(':');

    const hour = parseInt(h, 10);
    const minute = parseInt(m, 10);

    if (isNaN(hour) || isNaN(minute)) {
      setDate(dateObject.format(timeFormatInput));
      return;
    }

    const newDate = dayjs(created)
      .hour(hour)
      .minute(minute);
    updateCreated(newDate.format(dateFormat));
  };

  return {
    date,
    time,
    setDate,
    setTime,
    updateDate,
    updateTime,
  };
};

export default useDateTime;
