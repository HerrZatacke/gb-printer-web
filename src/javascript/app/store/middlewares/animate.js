import { GifWriter } from 'omggif';
import { saveAs } from 'file-saver';
import chunk from 'chunk';
import loadImageTiles from '../../../tools/loadImageTiles';
import getImagePalette from '../../../tools/getImagePalette';
import RGBNDecoder from '../../../tools/RGBNDecoder';
import Decoder from '../../../tools/Decoder';
import generateFileName from '../../../tools/generateFileName';

const getAddImages = (gifWriter, frameRate) => (canvas) => {
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

  gifWriter.addFrame(0, 0, canvas.width, canvas.height, pixels, {
    delay: Math.round(100 / frameRate),
    palette,
  });
};

const animate = (store) => (next) => (action) => {

  if (action.type === 'ANIMATE_IMAGES') {
    const state = store.getState();
    const {
      scaleFactor,
      frameRate,
      imageSelection,
      yoyo,
      frame: videoFrame,
      lockFrame: videoLockFrame,
      invertPalette: videoInvertPalette,
      palette: videoPalette,
      cropFrame,
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
        loadImageTiles(image, state)
          .then((tiles) => {
            const palette = getImagePalette(state, image);

            const isRGBN = !!image.hashes;
            const decoder = isRGBN ? new RGBNDecoder() : new Decoder();
            const lockFrame = videoLockFrame || image.lockFrame || false;
            const invertPalette = videoInvertPalette || image.invertPalette || false;

            if (isRGBN) {
              decoder.update({
                tiles: RGBNDecoder.rgbnTiles(tiles),
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

            return decoder.getScaledCanvas(scaleFactor, cropFrame);
          })
      )))
      .then((images) => {

        const buf = [];

        const gifWriter = new GifWriter(buf, images[0].width, images[0].height, {
          loop: 0xffff,
        });

        const addImages = getAddImages(gifWriter, frameRate);

        images.forEach(addImages);

        if (yoyo) {
          const reverseImages = [...images].reverse();

          // remove first and last image, as they would
          // appear dupliicated in the animation
          reverseImages.shift();
          reverseImages.pop();

          reverseImages.forEach(addImages);
        }

        const gifFileName = generateFileName({
          useCurrentDate: true,
          exportScaleFactor: scaleFactor,
          frameRate,
          altTitle: 'animated',
          frameName: videoFrame,
          paletteShort: videoPalette,
        });

        const bufferSize = gifWriter.end();

        return saveAs(
          new Blob(
            [new Uint8Array(buf.slice(0, bufferSize)).buffer],
          ),
          `${gifFileName}.gif`,
        );

        // const file = new File(
        //   [new Uint8Array(buf.slice(0, bufferSize)).buffer],
        //   `${gifFileName}.gif`,
        //   { type: 'image/gif' },
        // );
        // const fr = new FileReader();
        // fr.addEventListener('load', ({ target: { result } }) => {
        //   const img = document.createElement('img');
        //   img.src = result;
        //   document.body.appendChild(img);
        // });
        // fr.readAsDataURL(file);
      })
      .then((rr) => {
        console.log({ rr });
      })
      .catch((error) => {
        console.log({ error });
      });
  }

  next(action);
};

export default animate;
