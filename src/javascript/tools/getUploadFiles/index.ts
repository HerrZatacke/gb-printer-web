import filterDeleteNew from '../filterDeleteNew';
import getPrepareRemoteFiles from '../getPrepareRemoteFiles';
import { AddToQueueFn, RepoContents, RepoTasks, SyncFile } from '../../../types/Sync';
import { TypedStore } from '../../app/store/State';
import { getUploadImages } from './getUploadImages';
import { getUploadFrames } from './getUpladFrames';


const getUploadFiles = async (
  store: TypedStore,
  repoContents: RepoContents,
  lastUpdateUTC: number,
  addToQueue: AddToQueueFn<SyncFile | null>,
): Promise<RepoTasks> => {
  const state = store.getState();


  const prepareRemoteFiles = getPrepareRemoteFiles(store);
  const missingLocally: string[] = [];

  const {
    syncImages,
    missingLocally: missingImageHashes,
  } = await getUploadImages(state, repoContents, addToQueue);

  missingLocally.push(...missingImageHashes);

  const {
    syncFrames,
    missingLocally: missingFrameHashes,
  } = await getUploadFrames(state, repoContents, addToQueue);

  missingLocally.push(...missingFrameHashes);


  const syncFiles: SyncFile[] = [
    ...syncImages,
    ...syncFrames,
  ];

  const { toUpload, toKeep } = await prepareRemoteFiles(syncFiles, lastUpdateUTC);

  return filterDeleteNew(repoContents, toUpload, toKeep, missingLocally);
};

export default getUploadFiles;
