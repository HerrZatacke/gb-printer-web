import getGetSettings from '../getGetSettings';

const extFromType = (type) => {
  switch (type) {
    case 'image/png':
      return 'png';
    case 'image/jpg':
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'text/plain':
      return 'txt';
    case 'text/markdown':
      return 'md';
    case 'application/json':
    case 'text/json':
      return 'json';
    default:
      console.warn(`unknown file extension for type "${type}"`);
      return 'none';
  }
};

const getPrepareRemoteFiles = (store) => {
  const getSettings = getGetSettings(store);

  return (fileCollection) => {
    const toUpload = [];
    const toKeep = [];
    const stats = {};

    fileCollection.forEach(({ hash, files, inRepo }) => {
      toKeep.push(...inRepo.map(({ path }) => {
        const repoFolder = path.split('/')[0];
        stats[repoFolder] = stats[repoFolder] ? stats[repoFolder] + 1 : 1;

        return ({
          destination: path,
        });
      }));

      toUpload.push(...files.map(({ blob, folder }) => {
        const extension = extFromType(blob.type);
        const repoFolder = folder || extension;
        stats[repoFolder] = stats[repoFolder] ? stats[repoFolder] + 1 : 1;

        return ({
          destination: `${repoFolder}/${hash}.${extension}`,
          blob,
        });
      }));
    });

    const md = [
      '## Files in this repo:',
      ...Object.keys(stats).map((folder) => ` * ${folder}: [${stats[folder]}](/${folder})`),
    ]
      .join('\n');

    // querying only remote settings, so no state object needs to be provided
    return getSettings('remote')
      .then((remoteSettings) => {
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
      });
  };
};

export default getPrepareRemoteFiles;
