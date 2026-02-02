'use client';

import MuiMarkdown from 'mui-markdown';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import Lightbox from '@/components/Lightbox';
import MarkdownStack from '@/components/MarkdownStack';
import useTracking, { ConsentState } from '@/contexts/TrackingContext';
import { shortLocales } from '@/i18n/locales';
import readmeEn from '@/i18n/markdown/Analytics/en.md';
import { useSettingsStore } from '@/stores/stores';

export default function TrackingConsent() {
  const { showPopup, trackingAvailable, setConsent } = useTracking();
  const { preferredLocale } = useSettingsStore();
  const t = useTranslations('TrackingConsent');
  const [readme, setReadme] = useState(readmeEn);

  useEffect(() => {
    const set = async () => {
      let langFile = preferredLocale.split('-')[0];

      if (!shortLocales.includes(langFile)) {
        langFile = 'en';
      }

      try {
        setReadme((await import(`@/i18n/markdown/Analytics/${langFile}.md`)).default);
      } catch {
        setReadme(readmeEn);
      }
    };

    set();
  }, [preferredLocale]);

  if (!showPopup || !trackingAvailable) return null;

  return (
    <Lightbox
      confirm={() => setConsent(ConsentState.ACCEPTED)}
      deny={() => setConsent(ConsentState.DENIED)}
      header={t('title')}
      confirmMessage={t('confirm')}
      denyMessage={t('deny')}
      closeOnOverlayClick={false}
      contentWidth={600}
    >
      <MuiMarkdown options={{ wrapper: MarkdownStack }}>
        {readme}
      </MuiMarkdown>
    </Lightbox>
  );
};
