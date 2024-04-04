/* eslint-disable default-param-last */
import dayjs from 'dayjs';
import { Actions } from '../actions';
import dateFormatLocale from '../../../tools/dateFormatLocale';

interface PreferredLocaleAction {
  type: Actions.SET_PREFERRED_LOCALE,
  payload?: string,
}

const preferredLocaleReducer = (value = navigator.language, action: PreferredLocaleAction): string => {
  switch (action.type) {
    case Actions.SET_PREFERRED_LOCALE:
      if (!action.payload) {
        return value;
      }

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
