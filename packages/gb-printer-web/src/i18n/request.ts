import { getRequestConfig } from 'next-intl/server';
import messagesEn from '@/i18n/messages/en.json';

export default getRequestConfig(async () => {
  return {
    locale: 'en',
    messages: messagesEn,
    timeZone: 'UTC',
  };
});
