import Queue from 'promise-queue/lib';
import { GifWriter } from 'omggif';
import { saveAs } from 'file-saver';
import chunk from 'chunk';
import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import Decoder from '../../../tools/Decoder';
import generateFileName from '../../../tools/generateFileName';
import { Actions } from '../actions';
import applyRotation from '../../../tools/applyRotation';
import { isRGBNImage } from '../../../tools/isRGBNImage';

const getAddImages = (dispatch, gifWriter, queue, frameRate, total) => (canvas, index) => (
  queue.add(() => (
    new Promise((resolve, reject) => {
      const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

      const palette = [];
      const pixels = chunk(data, 4)
        .map(([r, g, b]) => {
          // eslint-disable-next-line no-bitwise
          const color = (r << 16) + (g << 8) + b;
          let colorIndex = palette.findIndex((c) => c === color);
          if (colorIndex === -1) {
            colorIndex = palette.length;
            palette.push(color);
          }

          return colorIndex;
        });

      // Fix for RGB Images
      while (palette.length < 256) {
        palette.push(0);
      }

      try {
        dispatch({
          type: Actions.CREATE_GIF_PROGRESS,
          payload: (index + 1) / total,
        });

        window.requestAnimationFrame(() => {
          gifWriter.addFrame(0, 0, canvas.width, canvas.height, pixels, {
            delay: Math.round(100 / frameRate),
            palette,
          });

          resolve();
        });
      } catch (error) {
        reject(error);
      }
    })
  ))
);

const animate = (store) => (next) => (action) => {

  if (action.type === Actions.ANIMATE_IMAGES) {
    const state = store.getState();
    const {
      scaleFactor,
      frameRate,
      imageSelection,
      yoyo,
      reverse,
      frame: videoFrame,
      lockFrame: videoLockFrame,
      invertPalette: videoInvertPalette,
      palette: videoPalette,
      exportFrameMode,
    } = state.videoParams;

    Promise.all(imageSelection.map((imageHash) => (
      state.images.find(({ hash }) => hash === imageHash)
    ))
      .filter(Boolean)
      .map((image) => (
        {
          ...image,
          frame: videoFrame || image.frame,
          palette: image.hashes ? image.palette : (videoPalette || image.palette),
        }
      ))
      .map((image) => (
        loadImageTiles(state)(image)
          .then((tiles) => {
            const palette = getImagePalette(state, image);

            const isRGBN = isRGBNImage(image);
            const decoder = isRGBN ? new RGBNDecoder() : new Decoder();
            const lockFrame = videoLockFrame || image.lockFrame || false;
            const invertPalette = videoInvertPalette || image.invertPalette || false;
            const rotation = image.rotation || 0;

            if (isRGBN) {
              decoder.update({
                tiles,
                palette,
                lockFrame,
              });
            } else {
              decoder.update({
                tiles,
                palette: palette.palette,
                lockFrame,
                invertPalette,
              });
            }

            const tempCanvas = decoder.getScaledCanvas(scaleFactor, exportFrameMode);
            const canvas = document.createElement('canvas');
            // Rotating is not consistent if different aspect ratio images are used.
            applyRotation(tempCanvas, canvas, rotation);

            return canvas;
          })
      )))
      .then((images) => {

        const buf = [];
        const queue = new Queue(1, Infinity);
        const gifWriter = new GifWriter(buf, images[0].width, images[0].height, {
          loop: 0xffff,
        });

        const allImages = [...images];

        if (yoyo) {
          const reverseImages = [...images].reverse();

          // remove first and last image, as they would
          // appear dupliicated in the animation
          reverseImages.shift();
          reverseImages.pop();

          allImages.push(...reverseImages);
        }

        if (reverse) {
          allImages.reverse();
        }

        const addImages = getAddImages(store.dispatch, gifWriter, queue, frameRate, allImages.length);

        Promise.all(allImages.map(addImages))
          .then(() => {

            const gifFileName = generateFileName({
              useCurrentDate: true,
              exportScaleFactor: scaleFactor,
              frameRate,
              altTitle: 'animated',
              frameName: videoFrame,
              paletteShort: videoPalette,
            });

            const bufferSize = gifWriter.end();

            let file;
            try {
              file = new File(
                [new Uint8Array(buf.slice(0, bufferSize)).buffer],
                `${gifFileName}.gif`,
                { type: 'image/gif' },
              );
            } catch (error) {
              file = new Blob(
                [new Uint8Array(buf.slice(0, bufferSize)).buffer],
              );
            }

            saveAs(file, `${gifFileName}.gif`);

            store.dispatch({
              type: Actions.CREATE_GIF_PROGRESS,
              payload: 0,
            });

            // const fr = new FileReader();
            // fr.addEventListener('load', ({ target: { result } }) => {
            //   const img = document.createElement('img');
            //   img.src = result;
            //   document.body.appendChild(img);
            // });
            // fr.readAsDataURL(file);
          });
      })
      .catch((error) => {
        store.dispatch({
          type: Actions.ERROR,
          payload: error.message,
        });
      });
  }

  next(action);
};

export default animate;
