import fs from 'fs';
import path from 'path';
import walkdir from 'walkdir';
import rimraf from 'rimraf';
import mkdirp from 'mkdirp';
import copyAndGZ from './copyAndGZ.js';
import config from './webpack.prod.mjs';

const { output: { path: outputPath } } = await config();
const projectConfig = JSON.parse(await fs.promises.readFile(path.join(process.cwd(), 'config.json'), { encoding: 'utf-8' }));

if (!projectConfig || !projectConfig.deploy || !projectConfig.deploy.dir) {
  console.error('Project Config of deploy dir missing');
  process.exit(0);
}

const { dir, gzip } = projectConfig.deploy;

const coypFunc = gzip ? copyAndGZ : fs.copyFile;

rimraf(`${dir}/*`, {}, () => {
  const wd = walkdir(outputPath);

  const ignored = [
    '.git',
    'bundles.html',
    'data_w.zip',
    'env.json',
  ];

  wd.on('file', (filePath, stats) => {
    const fileName = path.basename(filePath);
    const destination = path.join(dir, path.relative(outputPath, filePath));

    const relFilePath = path.relative(outputPath, filePath);
    const posixRelFilePath = relFilePath.split(path.sep).join(path.posix.sep);

    // Ignore files inside fav folder
    if (posixRelFilePath.startsWith('fav/')) {
      return;
    }

    if (!stats.size || ignored.includes(fileName)) {
      return;
    }

    wd.pause();

    mkdirp(path.dirname(destination))
      .then(() => {
        coypFunc(filePath, destination, (error) => {
          if (error) {
            console.error(error);
            return;
          }

          wd.resume();
        });
      });
  });
});
