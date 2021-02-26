import mime from 'mime-types';
import getGetSettings from '../../../../tools/getGetSettings';

const getPrepareGitFiles = (store) => {
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
        const extension = mime.extension(blob.type);
        const repoFolder = folder || extension;
        stats[repoFolder] = stats[repoFolder] ? stats[repoFolder] + 1 : 1;

        return ({
          destination: `${repoFolder}/${hash}.${extension}`,
          blob,
        });
      }));
    });

    // ToDo: can the imagelist be created from the existing images in local state?
    const imagelist = [...toUpload, ...toKeep]
      .filter(({ destination }) => destination.endsWith('png'))
      .map(({
        destination,
      }) => (`![](${destination} "")`))
      .join('\n');

    const md = [
      '## Files in this repo:',
      ...Object.keys(stats).map((folder) => ` * ${folder}: [${stats[folder]}](/${folder})`),
      '## Images:',
      imagelist,
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

export default getPrepareGitFiles;
