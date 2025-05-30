import hasher from 'object-hash';
import { localforageFrames } from '@/tools/localforageInstance';
import type { JSONExport, JSONExportState } from '@/types/ExportState';
import type { Frame } from '@/types/Frame';

interface OldFrame extends Omit<Frame, 'hash'> {
  hash?: string;
}

const hasUnhashedFrames = (frames: (Frame | OldFrame)[]): boolean => (
  Boolean(frames.find(({ hash }) => !hash))
);

export const hashStoredFrames = async (dirtyStateFrames: Frame[]): Promise<Frame[]> => {
  if (!hasUnhashedFrames(dirtyStateFrames)) {
    return dirtyStateFrames;
  }

  return Promise.all(dirtyStateFrames.map(async (frame: Frame): Promise<Frame> => {
    if (frame.hash) {
      return frame;
    }

    const frameData = await localforageFrames.getItem(frame.id);

    if (!frameData) {
      console.warn('could not load frame data for hashing');
      return frame;
    }

    const hash = hasher(frameData);
    await localforageFrames.removeItem(frame.id);
    await localforageFrames.setItem(hash, frameData);

    return {
      ...frame,
      hash,
    } as Frame;
  }));
};

export const hashImportFrames = async (newState: JSONExport | JSONExportState): Promise<JSONExport> => {
  const fixedState = newState as JSONExport;

  if (!fixedState.state.frames || !hasUnhashedFrames(fixedState.state.frames)) {
    return newState as JSONExport;
  }

  const frames = await Promise.all(fixedState.state.frames.map(async (frame: Frame): Promise<Frame> => {
    if (frame.hash) {
      return frame;
    }

    const frameKey = `frame-${frame.id}`;

    const frameData = fixedState[frameKey];

    if (!frameData) {
      console.warn(`could not load ${frameKey} from json import`);
      return frame;
    }

    const hash = hasher(frameData);
    delete fixedState[frameKey];
    fixedState[`frame-${hash}`] = frameData;

    return {
      ...frame,
      hash,
    } as Frame;
  }));

  return {
    ...fixedState,
    state: {
      ...fixedState.state,
      frames,
    },
  } as JSONExport;
};
