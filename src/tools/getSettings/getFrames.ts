import { getQueryClient } from '@/contexts/QueryClient';
import { binaryFramesByHashesQueryOptions } from '@/stores/queries/binaryFrames';
import { BinaryStoreItem } from '@/types/BinaryStoreItem';

const getFrames = async (exportFrameHashes: string[]): Promise<Record<string, string>> => {
  const queryClient = getQueryClient();
  const { items: result } = await queryClient.fetchQuery(binaryFramesByHashesQueryOptions(exportFrameHashes));

  const frames: Record<string, string> = {};
  result.forEach(({ hash, data }: BinaryStoreItem) => {
    frames[`frame-${hash}`] = data;
  });

  return frames;
};

export default getFrames;
