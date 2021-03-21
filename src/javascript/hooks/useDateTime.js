import { useState } from 'react';
import dayjs from 'dayjs';
import { dateFormatInput, timeFormatInput, dateFormat } from '../app/defaults';


window.dayjs = dayjs;

const useDateTime = (created, updateCreated) => {

  const dateObject = dayjs(created);
  const [date, setDate] = useState(created ? dateObject.format(dateFormatInput) : '');
  const [time, setTime] = useState(created ? dateObject.format(timeFormatInput) : '');

  const updateDate = (value) => {
    const [y, m, d] = value.split('-');

    const year = parseInt(y, 10);
    const month = parseInt(m, 10);
    const day = parseInt(d, 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      setDate(dateObject.format(dateFormatInput));
      return;
    }

    const newDate = dayjs(created)
      .date(d)
      .month(m - 1)
      .year(y);
    updateCreated(newDate.format(dateFormat));
  };

  const updateTime = (value) => {
    const [h, m] = value.split(':');

    const hour = parseInt(h, 10);
    const minute = parseInt(m, 10);

    if (isNaN(hour) || isNaN(minute)) {
      setDate(dateObject.format(timeFormatInput));
      return;
    }

    const newDate = dayjs(created)
      .hour(h)
      .minute(m);
    updateCreated(newDate.format(dateFormat));
  };

  // props.updatecreated(dayjs(target.value).format(dateFormat));


  return [
    date,
    time,
    setDate,
    setTime,
    updateDate,
    updateTime,
  ];
};

export default useDateTime;
