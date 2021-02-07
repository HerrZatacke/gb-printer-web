import { load, save } from '../../../../tools/storage';
import { loadFrameData, saveFrameData } from '../../../../tools/applyFrame/frameData';

const saveLocalStorageItems = (octoClient) => ({ images, frames }) => {

  const imagesTotal = images.length;
  const framesTotal = frames.length;

  return (
    Promise.all([
      ...images.map((image, imageIndex) => {
        const hash = image.name.substr(0, 40);

        // check if item exists locally
        return load(hash, null, true)
          .then((tiles) => {
            // if image exists locally, don't query from Repo
            if (tiles.length) {
              return hash;
            }

            return octoClient.getBlob(image.sha, imageIndex, imagesTotal)
              .then((blob) => {

                const lineBuffer = blob
                  .split('\n')
                  .filter((line) => line.match(/^[0-9a-f ]+$/gi));

                return save(lineBuffer);
              });
          });
      }),
      ...frames.map((frame, frameIndex) => {
        const frameId = frame.name.match(/^[a-z]+[0-9]+/gi)[0];

        // check if item exists locally
        return loadFrameData(frameId)
          .then((frameData) => {
            // if frame exists locally, don't query from Repo
            if (frameData) {
              return frameId;
            }

            return octoClient.getBlob(frame.sha, frameIndex, framesTotal)
              .then((blob) => {
                const tiles = JSON.parse(blob, null, 2);
                const black = Array(32)
                  .fill('f')
                  .join('');
                const pad = Array(16)
                  .fill(black);

                // tiles need to be padded with some lines that get stripped again when saving frame data
                const paddedFrameData = [
                  ...tiles.upper,
                  ...Array(14)
                    .fill()
                    .map((_, index) => ([
                      ...tiles.left[index],
                      ...pad,
                      ...tiles.right[index],
                    ]))
                    .flat(),
                  ...tiles.lower,
                ];
                return saveFrameData(frameId, paddedFrameData);
              });
          });
      }),
    ])
  );
};

export default saveLocalStorageItems;
