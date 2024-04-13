import { Image, RGBNHashes } from '../../../types/Image';

const getRGBNFrames = (
  { images }: { images: Image[] }, // ToDo: should be "state"
  { r, g, b, n }: RGBNHashes,
  defaultFrame: string | null,
): RGBNHashes => {

  if (defaultFrame) {
    return {
      r: defaultFrame,
      g: defaultFrame,
      b: defaultFrame,
      n: defaultFrame,
    };
  }

  const imageR = images.find((img) => img.hash === r);
  const imageG = images.find((img) => img.hash === g);
  const imageB = images.find((img) => img.hash === b);
  const imageN = images.find((img) => img.hash === n);

  return {
    r: imageR?.frame || undefined,
    g: imageG?.frame || undefined,
    b: imageB?.frame || undefined,
    n: imageN?.frame || undefined,
  };
};

export default getRGBNFrames;
