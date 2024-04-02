/* eslint-disable default-param-last */
import dayjs from 'dayjs';
import { Actions } from '../actions';
import dateFormatLocale from '../../../tools/dateFormatLocale';

const preferredLocaleReducer = (value = navigator.language, action) => {
  switch (action.type) {
    case Actions.SET_PREFERRED_LOCALE:

      // Try if provided locale can be used without throwing an error
      try {
        dateFormatLocale(dayjs(), action.payload);
        return action.payload;
      } catch (error) {
        console.error(error);
        return value;
      }

    default:
      return value;
  }
};

export default preferredLocaleReducer;
