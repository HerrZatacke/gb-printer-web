import filterDeleteNew from '@/tools/filterDeleteNew';
import getPrepareRemoteFiles from '@/tools/getPrepareRemoteFiles';
import type { RepoContents, RepoTasks, SyncFile } from '@/types/Export';
import type { AddToQueueFn } from '@/types/Sync';
import { getUploadFrames } from './getUploadFrames';
import { getUploadImages } from './getUploadImages';

const getUploadFiles = async (
  repoContents: RepoContents,
  lastUpdateUTC: number,
  addToQueue: AddToQueueFn<unknown>,
): Promise<RepoTasks> => {
  const prepareRemoteFiles = getPrepareRemoteFiles();
  const missingLocally: string[] = []; // ToDo: is this always empty?

  const {
    syncImages,
    missingLocally: missingImageHashes,
  } = await getUploadImages(repoContents, addToQueue as AddToQueueFn<SyncFile | null>);

  missingLocally.push(...missingImageHashes);

  const {
    syncFrames,
    missingLocally: missingFrameHashes,
  } = await getUploadFrames(repoContents, addToQueue as AddToQueueFn<SyncFile | null>);

  missingLocally.push(...missingFrameHashes);


  const syncFiles: SyncFile[] = [
    ...syncImages,
    ...syncFrames,
  ];

  const { toUpload, toKeep } = await prepareRemoteFiles(syncFiles, lastUpdateUTC);

  return filterDeleteNew(repoContents, toUpload, toKeep, missingLocally);
};

export default getUploadFiles;
