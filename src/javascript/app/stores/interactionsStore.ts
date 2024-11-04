import { create } from 'zustand';
import screenfull from 'screenfull';
import dayjs from 'dayjs';

export interface LogItem {
  timestamp: number,
  message: string,
}

export interface ProgressLog {
  git: LogItem[],
  dropbox: LogItem[],
}

export interface Progress {
  gif: number,
  printer: number,
  plugin: number,
}

export interface TrashCount {
  frames: number,
  images: number,
  show: boolean,
}

interface WindowDimensions {
  width: number,
  height: number,
}

export interface ErrorMessage {
  error: Error
  timestamp: number,
}

interface Values {
  dragover: boolean,
  isFullscreen: boolean,
  errors: ErrorMessage[],
  syncBusy: boolean,
  syncSelect: boolean,
  lightboxImage: number | null,
  progressLog: ProgressLog,
  progress: Progress,
  trashCount: TrashCount,
  windowDimensions: WindowDimensions,
}

interface Actions {
  dismissError: (index: number) => void,
  resetProgressLog: () => void,
  setDragover: (dragover: boolean) => void,
  setError: (error: Error) => void,
  setIsFullscreen: (isFullscreen: boolean) => void,
  setProgress: (which: keyof Progress, progress: number) => void,
  setProgressLog: (which: keyof ProgressLog, logItem: LogItem) => void,
  setLightboxImage: (index: number | null) => void,
  setLightboxImageNext: (maxImages: number) => void,
  setLightboxImagePrev: () => void,
  setSyncBusy: (syncBusy: boolean) => void,
  setSyncSelect: (syncBusy: boolean) => void,
  setWindowDimensions: () => void,
  showTrashCount: (show: boolean) => void,
  updateTrashCount: (frames: number, images: number) => void,
}

export type InteractionsState = Values & Actions;

const useInteractionsStore = create<InteractionsState>((set, get) => ({
  dragover: false,
  isFullscreen: false,
  errors: [],
  lightboxImage: null,
  progressLog: { git: [], dropbox: [] },
  progress: { gif: 0, printer: 0, plugin: 0 },
  syncBusy: false,
  syncSelect: false,
  trashCount: { frames: 0, images: 0, show: false },
  windowDimensions: { width: window.innerWidth, height: window.innerHeight },

  resetProgressLog: () => set({ progressLog: { git: [], dropbox: [] } }),
  dismissError: (index: number) => set({ errors: get().errors.filter((_, i) => i !== index) }),
  setDragover: (dragover: boolean) => set({ dragover }),
  setError: (error: Error) => set({ errors: [...get().errors, { error, timestamp: dayjs().unix() }] }),
  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),
  setProgress: (which: keyof Progress, progress: number) => set({ progress: { ...get().progress, [which]: progress } }),
  setSyncBusy: (syncBusy: boolean) => set({ syncBusy }),
  setSyncSelect: (syncSelect: boolean) => set({ syncSelect }),
  setWindowDimensions: () => set({ windowDimensions: { width: window.innerWidth, height: window.innerHeight } }),
  showTrashCount: (show: boolean) => set({ trashCount: { ...get().trashCount, show } }),
  updateTrashCount: (frames: number, images: number) => set({ trashCount: { show: false, frames, images } }),

  setProgressLog: (which: keyof ProgressLog, logItem: LogItem) => {
    const { progressLog } = get();
    set({
      progressLog: {
        ...progressLog,
        [which]: [
          logItem,
          ...progressLog[which],
        ],
      },
    });
  },

  setLightboxImage: (lightboxImage: number | null) => {
    if (lightboxImage === null) {
      screenfull.exit();
    }

    set({ lightboxImage });
  },

  setLightboxImageNext: (maxImages: number) => {
    const stateLightboxImage = get().lightboxImage;
    if (stateLightboxImage !== null) {
      set({ lightboxImage: Math.min(stateLightboxImage + 1, maxImages - 1) });
    }
  },

  setLightboxImagePrev: () => {
    const stateLightboxImage = get().lightboxImage;
    if (stateLightboxImage !== null) {
      set({ lightboxImage: Math.max(stateLightboxImage - 1, 0) });
    }
  },
}));

export default useInteractionsStore;
