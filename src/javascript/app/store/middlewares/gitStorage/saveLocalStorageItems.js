import { load, save } from '../../../../tools/storage';

const saveLocalStorageItems = (octoClient) => ({ images, frames }) => (
  Promise.all([
    ...images.map((image) => {
      const hash = image.name.substr(0, 40);

      // check if item exists locally
      return load(hash, null, true)
        .then((tiles) => {
          // if image exists locally, don't query from Repo
          if (tiles.length) {
            return hash;
          }

          return octoClient.getBlob(image.sha)
            .then((blob) => {

              const lineBuffer = blob
                .split('\n')
                .filter((line) => line.match(/^[0-9a-f ]+$/gi));

              return save(lineBuffer);
            });
        });
    }),
  ])
    .then((stored) => {
      console.log(stored);
    })
);

export default saveLocalStorageItems;
