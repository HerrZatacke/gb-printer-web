import { State } from '../../app/store/State';
import { AddToQueueFn, RepoContents, RepoFile, SyncFile } from '../../../types/Sync';
import { loadFrameData } from '../applyFrame/frameData';
import { Frame } from '../../../types/Frame';

interface TmpInfo {
  file: Frame,
  inRepo: RepoFile[],
  searchHashes: string[],
}

export const getUploadFrames = async (
  state: State,
  repoContents: RepoContents,
  addToQueue: AddToQueueFn<SyncFile | null>,
): Promise<{
  syncFrames: SyncFile[],
  missingLocally: string[],
}> => {
  const missingLocally: string[] = [];

  const frames: TmpInfo[] = state.frames.map((frame): TmpInfo => ({
    file: frame,
    searchHashes: [frame.hash],
    inRepo: ([
      repoContents.frames.find(({ hash }: RepoFile) => hash === frame.hash),
    ].filter(Boolean) as RepoFile[]),
  }));
  const framesLength = frames.length;


  const syncFrames: (SyncFile | null)[] = await Promise.all(
    frames.map((tmpInfo, index) => {

      const frame = tmpInfo.file as Frame;

      return (
        tmpInfo.inRepo.length ? ({
          ...frame,
          inRepo: tmpInfo.inRepo,
          files: [],
        }) : (
          addToQueue(`loadFrameData (${index + 1}/${framesLength}) ${frame.id}`, 3, async (): Promise<SyncFile | null> => {
            const frameData = await loadFrameData(frame.hash);
            return {
              ...frame,
              inRepo: tmpInfo.inRepo,
              files: [{
                folder: 'frames',
                filename: '',
                blob: new Blob(new Array(JSON.stringify(frameData || '{}', null, 2)), { type: 'application/json' }),
                title: frame.name,
              }],
            };
          })
        )
      );
    }),
  );

  return {
    syncFrames: (syncFrames.filter(Boolean) as SyncFile[]),
    missingLocally,
  };
};
