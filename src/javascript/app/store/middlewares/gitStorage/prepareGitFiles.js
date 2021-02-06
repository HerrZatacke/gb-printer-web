import mime from 'mime-types';
import getSettings from '../../../../tools/getSettings';

const prepareGitFiles = (imageCollection) => {
  const toUpload = [];

  imageCollection.forEach(({ hash, files, hashes }) => {
    toUpload.push(...files.map(({ blob, title, folder }) => {
      const extension = mime.extension(blob.type);

      return ({
        destination: `${folder || extension}/${hash}.${extension}`,
        blob,
        extension,
        title,
        hash: hashes ? null : hash,
      });
    }));
  });

  const md = toUpload
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

  const remoteSettings = getSettings('remote');

  toUpload.push(
    {
      destination: 'readme.md',
      blob: new Blob([...md], { type: 'text/plain' }),
    },
    {
      destination: 'settings.json',
      blob: new Blob([...remoteSettings], { type: 'application/json' }),
    },
  );

  return toUpload.filter(Boolean);
};

export default prepareGitFiles;
