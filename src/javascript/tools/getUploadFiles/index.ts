import filterDeleteNew from '../filterDeleteNew';
import getPrepareRemoteFiles from '../getPrepareRemoteFiles';
import { AddToQueueFn } from '../../../types/Sync';
import { RepoContents, RepoTasks, SyncFile } from '../../../types/Export';
import { TypedStore } from '../../app/store/State';
import { getUploadImages } from './getUploadImages';
import { getUploadFrames } from './getUpladFrames';


const getUploadFiles = async (
  store: TypedStore,
  repoContents: RepoContents,
  lastUpdateUTC: number,
  addToQueue: AddToQueueFn<unknown>,
): Promise<RepoTasks> => {
  const state = store.getState();


  const prepareRemoteFiles = getPrepareRemoteFiles(store);
  const missingLocally: string[] = [];

  const {
    syncImages,
    missingLocally: missingImageHashes,
  } = await getUploadImages(state, repoContents, addToQueue as AddToQueueFn<SyncFile | null>);

  missingLocally.push(...missingImageHashes);

  const {
    syncFrames,
    missingLocally: missingFrameHashes,
  } = await getUploadFrames(state, repoContents, addToQueue as AddToQueueFn<SyncFile | null>);

  missingLocally.push(...missingFrameHashes);


  const syncFiles: SyncFile[] = [
    ...syncImages,
    ...syncFrames,
  ];

  const { toUpload, toKeep } = await prepareRemoteFiles(syncFiles, lastUpdateUTC);

  return filterDeleteNew(repoContents, toUpload, toKeep, missingLocally);
};

export default getUploadFiles;
