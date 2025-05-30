import { localforageFrames } from '@/tools/localforageInstance';

const getFrames = async (exportFrameHashes: string[]): Promise<Record<string, string>> => {
  const result = await Promise.all(exportFrameHashes.map(async (hash) => {
    const data = await localforageFrames.getItem(hash);
    return {
      hash,
      data,
    };
  }));

  const frames: Record<string, string> = {};
  result.forEach(({ hash, data }) => {
    if (data) {
      frames[`frame-${hash}`] = data;
    }
  });

  return frames;
};

export default getFrames;
