import fs  from 'node:fs/promises';
import path  from 'node:path/posix';
import { $fetch } from 'ofetch';
import { type POEExport, type POELanguages, type POEResponse } from './types';

const POEDITOR_API_TOKEN = process.env.POEDITOR_API_TOKEN ||'';
const POEDITOR_API_PROJECT_ID = process.env.POEDITOR_API_PROJECT_ID ||'';

if (!POEDITOR_API_TOKEN || !POEDITOR_API_PROJECT_ID) {
  throw new Error('POEDITOR_API_TOKEN or POEDITOR_API_PROJECT_ID missing');
}

const outDir = path.resolve('src', 'i18n', 'messages');
await fs.mkdir(outDir, { recursive: true });

const listLanguagesResponse = await $fetch<POEResponse<POELanguages>>('https://api.poeditor.com/v2/languages/list', {
  method: 'POST',
  body: new URLSearchParams({
    api_token: POEDITOR_API_TOKEN,
    id: POEDITOR_API_PROJECT_ID,
  }),
});

const languageKeys = listLanguagesResponse.result.languages.map(({ code }) => code);

for (const exportLanguage of languageKeys) {
  const languageExportResponse = await $fetch<POEResponse<POEExport>>('https://api.poeditor.com/v2/projects/export', {
    method: 'POST',
    body: new URLSearchParams({
      api_token: POEDITOR_API_TOKEN,
      id: POEDITOR_API_PROJECT_ID,
      language: exportLanguage,
      fallback_language: 'en',
      type: 'i18next',
      order: 'terms',
    }),
  });

  const languageExport = await $fetch(languageExportResponse.result.url, { responseType: 'json' });

  await fs.writeFile(`${outDir}/${exportLanguage}.json`, JSON.stringify(languageExport, null, 2));
}

