'use client';

import defu from 'defu';
import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren, useEffect, useState } from 'react';
import { formats } from '@/i18n/formats';
import { defaultLocale, locales, shortLocales } from '@/i18n/locales';
import messagesEn from '@/i18n/messages/en.json';
import useSettingsStore from '@/stores/settingsStore';

function I18nContext({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState('en');
  const [messages, setMessages] = useState(messagesEn);
  const [timeZone, setTimeZone] = useState('UTC');

  const { preferredLocale, setPreferredLocale } = useSettingsStore();

  useEffect(() => {
    if (!locales.includes(preferredLocale)) {
      setPreferredLocale(defaultLocale);
    }
  }, [preferredLocale, setPreferredLocale]);

  useEffect(() => {
    const set = async () => {
      let langFile = preferredLocale.split('-')[0];

      if (!shortLocales.includes(langFile)) {
        langFile = 'en';
      }

      const localeMessages = (await import(`@/i18n/messages/${langFile}.json`)).default;

      setMessages(defu(localeMessages, messagesEn));
      setLocale(preferredLocale);
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    };

    set();
  }, [preferredLocale]);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
      formats={formats}
    >
      {children}
    </NextIntlClientProvider>
  );
}

export default I18nContext;
