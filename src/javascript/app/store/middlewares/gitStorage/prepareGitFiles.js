import mime from 'mime-types';
import getSettings from '../../../../tools/getSettings';

const prepareGitFiles = (fileCollection) => {
  const toUpload = [];
  const toKeep = [];
  const stats = {};

  fileCollection.forEach(({ hash, files, hashes, inRepo }) => {
    toKeep.push(...inRepo);

    toUpload.push(...files.map(({ blob, title, folder }) => {
      const extension = mime.extension(blob.type);
      const repoFolder = folder || extension;

      stats[repoFolder] = stats[repoFolder] ? stats[repoFolder] + 1 : 1;

      return ({
        destination: `${repoFolder}/${hash}.${extension}`,
        blob,
        extension,
        title,
        hash: hashes ? null : hash,
      });
    }));
  });

  const imagelist = toUpload
    .filter(({ extension }) => extension === 'png')
    .map(({
      destination,
      hash,
      title,
    }) => (
      hash ?
        `[![${title}](${destination} "${title}")](images/${hash}.txt)` :
        `![${title}](${destination} "${title}")`
    ))
    .join('\n');

  const md = [
    '## Files in this repo:',
    ...Object.keys(stats).map((folder) => ` * ${folder}: [${stats[folder]}](/${folder})`),
    '## Images:',
    imagelist,
  ]
    .join('\n');

  const remoteSettings = getSettings('remote');

  toUpload.push(
    {
      destination: 'README.md',
      blob: new Blob([...md], { type: 'text/plain' }),
    },
    {
      destination: 'settings.json',
      blob: new Blob([...remoteSettings], { type: 'application/json' }),
    },
  );

  return {
    toUpload: toUpload.filter(Boolean),
    toKeep: toKeep.filter(Boolean),
  };
};

export default prepareGitFiles;
