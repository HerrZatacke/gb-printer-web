import fs  from 'node:fs/promises';
import path  from 'node:path/posix';
import { $fetch } from 'ofetch';
import { type POEUpload, type POEResponse } from './types';

const POEDITOR_API_TOKEN = process.env.POEDITOR_API_TOKEN ||'';
const POEDITOR_API_PROJECT_ID = process.env.POEDITOR_API_PROJECT_ID ||'';

if (!POEDITOR_API_TOKEN || !POEDITOR_API_PROJECT_ID) {
  throw new Error('POEDITOR_API_TOKEN or POEDITOR_API_PROJECT_ID missing');
}

const LANGUAGE = 'en';

const sourceFile = path.resolve('src', 'i18n', 'messages', `${LANGUAGE}.json`);
const buffer = await fs.readFile(sourceFile);
const file = new File([buffer], `${LANGUAGE}.json`, { type: 'application/json' });

const uploadBody = new FormData();

uploadBody.append('api_token', POEDITOR_API_TOKEN);
uploadBody.append('id', POEDITOR_API_PROJECT_ID);
uploadBody.append('updating', 'terms_translations');
uploadBody.append('file', file);
uploadBody.append('language', LANGUAGE);
uploadBody.append('overwrite', '0');
uploadBody.append('sync_terms', '0');
uploadBody.append('fuzzy_trigger', '1');

const uploadResponse = await $fetch<POEResponse<POEUpload>>('https://api.poeditor.com/v2/projects/upload', {
  method: 'POST',
  body: uploadBody,
});

console.log(uploadResponse);
