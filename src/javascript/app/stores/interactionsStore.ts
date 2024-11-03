import { create } from 'zustand';
import screenfull from 'screenfull';
import dayjs from 'dayjs';
import type { ProgressLog } from '../../../types/actions/LogActions';
import type { Progress } from '../store/reducers/progressReducer';

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
  lightboxImage: number | null,
  progressLog: ProgressLog,
  progress: Progress,
  trashCount: TrashCount,
  windowDimensions: WindowDimensions,
}

interface Actions {
  dismissError: (index: number) => void,
  setDragover: (dragover: boolean) => void,
  setError: (error: Error) => void,
  setIsFullscreen: (isFullscreen: boolean) => void,
  setLightboxImage: (index: number | null) => void,
  setLightboxImageNext: (maxImages: number) => void,
  setLightboxImagePrev: () => void,
  setWindowDimensions: () => void,
  showTrashCount: (show: boolean) => void,
  updateTrashCount: (frames: number, images: number) => void,
}

export type InteractionsState = Values & Actions;

const useInteractionsStore = create<InteractionsState>((set, get) => ({
  dragover: false,
  isFullscreen: false,
  errors: [],
  syncBusy: false,
  lightboxImage: null,
  progressLog: { git: [], dropbox: [] },
  progress: { gif: 0, printer: 0, plugin: 0 },
  trashCount: { frames: 0, images: 0, show: false },
  windowDimensions: { width: window.innerWidth, height: window.innerHeight },

  dismissError: (index: number) => set({ errors: get().errors.filter((_, i) => i !== index) }),
  setDragover: (dragover: boolean) => set({ dragover }),
  setError: (error: Error) => set({ errors: [...get().errors, { error, timestamp: dayjs().unix() }] }),
  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),
  setWindowDimensions: () => set({ windowDimensions: { width: window.innerWidth, height: window.innerHeight } }),
  showTrashCount: (show: boolean) => set({ trashCount: { ...get().trashCount, show } }),
  updateTrashCount: (frames: number, images: number) => set({ trashCount: { show: false, frames, images } }),

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
