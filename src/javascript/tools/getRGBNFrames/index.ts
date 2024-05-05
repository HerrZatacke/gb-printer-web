import { RGBNHashes } from '../../../types/Image';
import { State } from '../../app/store/State';

const getRGBNFrames = (
  { images }: State,
  hashes: RGBNHashes,
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

  const imageR = images.find((img) => img.hash === hashes?.r);
  const imageG = images.find((img) => img.hash === hashes?.g);
  const imageB = images.find((img) => img.hash === hashes?.b);
  const imageN = images.find((img) => img.hash === hashes?.n);

  return {
    r: imageR?.frame || undefined,
    g: imageG?.frame || undefined,
    b: imageB?.frame || undefined,
    n: imageN?.frame || undefined,
  };
};

export default getRGBNFrames;
