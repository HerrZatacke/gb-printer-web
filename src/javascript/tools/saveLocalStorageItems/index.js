import { load, save } from '../storage';
import { loadFrameData, saveFrameData } from '../applyFrame/frameData';

const saveLocalStorageItems = ({ images, frames }) => {

  const imagesTotal = images.length;
  const framesTotal = frames.length;

  return (
    Promise.all([
      ...images.map((image, imageIndex) => (
        // check if item exists locally
        load(image.hash, null, true)
          .then((tiles) => {
            // if image exists locally, don't download blob
            if (tiles.length) {
              return image.hash;
            }

            return image.getBlob(image.sha, imageIndex, imagesTotal)
              .then((blob) => {

                const lineBuffer = blob
                  .split('\n')
                  .filter((line) => line.match(/^[0-9a-f ]+$/gi));

                return save(lineBuffer);
              });
          })
      )),
      ...frames.map((frame, frameIndex) => (
        // check if item exists locally
        loadFrameData(frame.id)
          .then((frameData) => {
            // if frame exists locally, don't download blob
            if (frameData) {
              return frame.id;
            }

            return frame.getBlob(frame.sha, frameIndex, framesTotal)
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
                return saveFrameData(frame.id, paddedFrameData);
              });
          })
      )),
    ])
  );
};

export default saveLocalStorageItems;
