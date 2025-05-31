import { globby } from 'globby';
import fs from 'node:fs';

const outDir = 'out';
const filesToShorten = await globby([`${outDir}/**/*.html`]);

for (const filePath of filesToShorten) {
  const replacementRegex = /<meta\s+name=["']replacewith["']\s+content=["']([^"']+)["']\s*\/?>/i;
  const fileContents = await fs.promises.readFile(filePath, { encoding: 'utf-8' });
  const match = fileContents.match(replacementRegex);

  if (match) {
    const contentFile = match[1];
    const replacement = await fs.promises.readFile(contentFile, { encoding: 'utf-8' });
    const changedContent = fileContents.replace(replacementRegex, replacement);
    await fs.promises.writeFile(filePath, changedContent, { encoding: 'utf-8' });
  }
}
