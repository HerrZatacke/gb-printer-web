import dayjs from 'dayjs';
import screenfull from 'screenfull';
import { v4 } from 'uuid';
import { create } from 'zustand';
import type { PrinterFunction } from '@/consts/printerFunction';
import type { PrinterInfo } from '@/types/Printer';

export interface LogItem {
  timestamp: number,
  message: string,
}

export interface ProgressLog {
  git: LogItem[],
  dropbox: LogItem[],
}

export interface Progress {
  id: string,
  label: string,
  value: number,
}

export interface TrashCount {
  frames: number,
  images: number,
  show: boolean,
}

export interface ErrorMessage {
  error: Error
  timestamp: number,
  id: string,
}

interface Values {
  dragover: boolean,
  errors: ErrorMessage[],
  isFullscreen: boolean,
  lightboxImage: number | null,
  progress: Progress[],
  progressLog: ProgressLog,
  printerBusy: boolean,
  printerData: PrinterInfo | null,
  printerFunctions: PrinterFunction[],
  showSerials: boolean,
  syncBusy: boolean,
  syncSelect: boolean,
  trashCount: TrashCount,
  videoSelection: string[],
}

interface Actions {
  dismissError: (index: number) => void,
  resetProgressLog: () => void,
  setDragover: (dragover: boolean) => void,
  setError: (error: Error) => void,
  setIsFullscreen: (isFullscreen: boolean) => void,
  setLightboxImage: (index: number | null) => void,
  setLightboxImageNext: (maxImages: number) => void,
  setLightboxImagePrev: () => void,
  setPrinterBusy: (printerBusy: boolean) => void,
  setPrinterData: (printerData: PrinterInfo | null) => void,
  setPrinterFunctions: (printerFunctions: PrinterFunction[]) => void,
  startProgress: (label: string) => string,
  setProgress: (id: string, progress: number) => void,
  stopProgress: (id: string) => void,
  setProgressLog: (which: keyof ProgressLog, logItem: LogItem) => void,
  setShowSerials: (showSerials: boolean) => void,
  setSyncBusy: (syncBusy: boolean) => void,
  setSyncSelect: (syncBusy: boolean) => void,
  showTrashCount: (show: boolean) => void,
  updateTrashCount: (frames: number, images: number) => void,
  setVideoSelection: (videoSelection: string[]) => void,
}

export type InteractionsState = Values & Actions;

const useInteractionsStore = create<InteractionsState>((set, get) => ({
  dragover: false,
  errors: [],
  isFullscreen: false,
  lightboxImage: null,
  printerBusy: false,
  printerData: null,
  printerFunctions: [],
  progress: [],
  progressLog: { git: [], dropbox: [] },
  showSerials: false,
  syncBusy: false,
  syncSelect: false,
  trashCount: { frames: 0, images: 0, show: false },
  videoSelection: [],

  dismissError: (index: number) => set({ errors: get().errors.filter((_, i) => i !== index) }),
  resetProgressLog: () => set({ progressLog: { git: [], dropbox: [] } }),
  setDragover: (dragover: boolean) => set({ dragover }),
  setError: (error: Error) => set({ errors: [...get().errors, { error, timestamp: dayjs().unix(), id: v4() }] }),
  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),
  setPrinterBusy: (printerBusy: boolean) => set({ printerBusy }),
  setPrinterData: (printerData: PrinterInfo | null) => set({ printerData }),
  setPrinterFunctions: (printerFunctions: PrinterFunction[]) => set({ printerFunctions }),
  setShowSerials: (showSerials: boolean) => set({ showSerials }),
  setSyncBusy: (syncBusy: boolean) => set({ syncBusy }),
  setSyncSelect: (syncSelect: boolean) => set({ syncSelect }),
  showTrashCount: (show: boolean) => set({ trashCount: { ...get().trashCount, show } }),
  updateTrashCount: (frames: number, images: number) => set({ trashCount: { ...get().trashCount, frames, images } }),
  setVideoSelection: (videoSelection: string[]) => set({ videoSelection }),

  startProgress: (label: string): string => {
    const newProgress: Progress = {
      id: v4(),
      label,
      value: 0,
    };
    set(({ progress }) => ({ progress: [...progress, newProgress] }));
    return newProgress.id;
  },

  setProgress: (id: string, progressValue: number) => {
    set(({ progress }) => ({
      progress: progress.map((progressEntry): Progress => (
        (progressEntry.id !== id) ? progressEntry : {
          ...progressEntry,
          value: progressValue,
        }
      )),
    }));
  },

  stopProgress: (id: string) => {
    set(({ progress }) => ({
      progress: progress.filter((progressEntry) => (progressEntry.id !== id)),
    }));
  },

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

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.se = useInteractionsStore.getState().setError;
}

export default useInteractionsStore;
