import fs from 'fs/promises';
import crypto from 'node:crypto';
import path from 'path';
import { favicons } from 'favicons';
import { rimraf } from 'rimraf';

interface Params {
  description: string,
  name: string,
  author: string,
  homepage: string,
  basePath: string,
  version: string,
}

export default async function generateWebManifest({
  description,
  name,
  author,
  homepage,
  basePath,
  version,
}: Params): Promise<string> {
  const favDir = 'fav';
  const dest = `./public/${favDir}`;
  const icon = './src/assets/images/favicon.png';

  await rimraf(dest);

  const response = await favicons(icon, {
    appName: 'GBC Gallery',
    appDescription: description,
    appShortName: name,
    developerName: author,
    developerURL: homepage,
    background: '#d6d3dc',
    theme_color: '#000000',
    appleStatusBarStyle: 'black',
    path: `${basePath}/${favDir}`,
    scope: `${basePath}/`,
    start_url: `${basePath}/gallery/`,
    version,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      favicons: true,
      windows: true,
      yandex: false,
    },
    shortcuts: [
      // https://developer.mozilla.org/docs/Web/Manifest/shortcuts)
      {
        name: 'Gallery',
        short_name: 'gallery',
        url: `${basePath}/gallery/`,
        icon,
      },
      {
        name: 'Palettes',
        short_name: 'palettes',
        url: `${basePath}/palettes/`,
        icon,
      },
      {
        name: 'Frames',
        short_name: 'frames',
        url: `${basePath}/frames/`,
        icon,
      },
    ],
  });

  await fs.mkdir(dest, { recursive: true });
  await Promise.all(
    response.images.map(
      async (image) =>
        await fs.writeFile(path.join(dest, image.name), image.contents),
    ),
  );
  await Promise.all(
    response.files.map(
      async (file) =>
        await fs.writeFile(path.join(dest, file.name), file.contents),
    ),
  );

  const tagsFileContent = response.html.join('');

  const hash = crypto.createHash('sha256')
    .update(tagsFileContent)
    .digest('hex')
    .slice(0, 6);

  const tagsFile = path.join(dest, `${hash}.html`);

  await fs.writeFile(tagsFile, tagsFileContent);

  return tagsFile;
}
