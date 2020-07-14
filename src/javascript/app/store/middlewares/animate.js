import WebMWriter from 'webm-writer';
import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import Decoder from '../../../tools/Decoder';

const animate = (store) => (next) => (action) => {

  if (action.type === 'ANIMATE_IMAGES') {
    const state = store.getState();
    const { scaleFactor, frameRate, imageSelection } = state.videoParams;

    const videoWriter = new WebMWriter({
      quality: 0.98,
      frameRate,
    });

    Promise.all(imageSelection.map((imageHash) => (
      state.images.find(({ hash }) => hash === imageHash)
    ))
      .filter(Boolean)
      .map((image) => (
        loadImageTiles(image, state)
          .then((tiles) => {
            const palette = getImagePalette(state, image);

            const isRGBN = !!image.hashes;
            const decoder = isRGBN ? new RGBNDecoder() : new Decoder();
            const lockFrame = image.lockFrame || false;

            if (isRGBN) {
              decoder.update(null, RGBNDecoder.rgbnTiles(tiles), palette, lockFrame);
            } else {
              decoder.update(null, tiles, palette.palette, lockFrame);
            }

            return decoder.getScaledCanvas(scaleFactor);
          })
      )))
      .then((images) => {
        images.forEach((canvas) => {
          videoWriter.addFrame(canvas);
        });

        videoWriter.complete().then((webMBlob) => {
          const video = document.createElement('video');
          video.src = URL.createObjectURL(webMBlob);
          video.loop = true;
          video.controls = true;
          document.querySelector('body').appendChild(video);
        });
      });
  }

  next(action);
};

export default animate;
