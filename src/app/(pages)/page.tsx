'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import  MuiMarkdown from 'mui-markdown';
import { useEffect, useState } from 'react';
import MarkdownStack from '@/components/MarkdownStack';
import useProcessMarkdownLinks from '@/hooks/useProcessMarkdownLinks';
import { shortLocales } from '@/i18n/locales';
import readmeEn from '@/i18n/markdown/Startpage/en.md';
import useSettingsStore from '@/stores/settingsStore';

export default function Home() {
  const [readme, setReadme] = useState(readmeEn);
  const { preferredLocale } = useSettingsStore();
  const processedReadme = useProcessMarkdownLinks(readme);

  useEffect(() => {
    const set = async () => {
      let langFile = preferredLocale.split('-')[0];

      if (!shortLocales.includes(langFile)) {
        langFile = 'en';
      }

      try {
        setReadme((await import(`@/i18n/markdown/Startpage/${langFile}.md`)).default);
      } catch {
        setReadme(readmeEn);
      }
    };

    set();
  }, [preferredLocale]);

  return (
    <Card>
      <CardContent>
        <MuiMarkdown options={{ wrapper: MarkdownStack }}>
          {processedReadme}
        </MuiMarkdown>
      </CardContent>
    </Card>
  );
}
