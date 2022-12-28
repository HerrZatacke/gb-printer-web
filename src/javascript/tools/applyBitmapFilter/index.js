import generatePattern from './generatePattern.mjs';
import { orderPatternDither, orderPatternNoDither } from './orderPatterns.mjs';
import generateBaseValues from './generateBaseValues.mjs';

let pixelCount = 0;
export const ditherFilter = (imageData, contrastBaseValues, dither, colors) => {
  const ditheredImageData = new ImageData(imageData.width, imageData.height);

  const contrastMatrix = generatePattern({
    baseValues: generateBaseValues(contrastBaseValues),
    orderPatterns: [
      dither ? orderPatternDither : orderPatternNoDither,
      dither ? orderPatternDither : orderPatternNoDither,
      dither ? orderPatternDither : orderPatternNoDither,
    ],
  });

  const w = imageData.width;
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const x = (pixelCount % w) % 4;
    const y = Math.ceil(pixelCount / w) % 4;

    // let p = Math.ceil((pixels[i] + 255) / 2);
    const pixel = pixels[i];
    let color;
    const ditherGroup = contrastMatrix[x][y];

    if (pixel <= ditherGroup[0]) {
      color = colors[3];
    } else if (pixel <= ditherGroup[1]) {
      color = colors[2];
    } else if (pixel <= ditherGroup[2]) {
      color = colors[1];
    } else {
      color = colors[0];
    }

    ditheredImageData.data[i] = color.r;
    ditheredImageData.data[i + 1] = color.g;
    ditheredImageData.data[i + 2] = color.b;
    ditheredImageData.data[i + 3] = 255;
    pixelCount += 1;
  }

  return ditheredImageData;
};

export const applyBitmapFilter = ({
  targetCanvas,
  originalCanvas,
  imageData,
  palette,
  dither,
  contrastBaseValues,
}) => {
  const colors = palette.map((hexVal) => ({
    r: parseInt(hexVal.slice(1, 3), 16),
    g: parseInt(hexVal.slice(3, 5), 16),
    b: parseInt(hexVal.slice(5, 7), 16),
  }));

  const context = targetCanvas.getContext('2d');
  context.putImageData(ditherFilter(imageData, contrastBaseValues, dither, colors), 0, 0);
  const originalContext = originalCanvas.getContext('2d');
  originalContext.putImageData(imageData, 0, 0);
};
