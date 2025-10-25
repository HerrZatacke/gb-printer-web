import dayjs from 'dayjs';
import screenfull from 'screenfull';
import { v4 } from 'uuid';
import { create } from 'zustand';
import type { PrinterFunction } from '@/consts/printerFunction';
import type { PrinterInfo } from '@/types/Printer';

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
  downloadHashes: string[],
  dragover: boolean,
  errors: ErrorMessage[],
  isFullscreen: boolean,
  lightboxImage: number | null,
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
  setDownloadHashes: (downloadHashes: string[]) => void,
  setDragover: (dragover: boolean) => void,
  setError: (error: Error) => void,
  setIsFullscreen: (isFullscreen: boolean) => void,
  setLightboxImage: (index: number | null) => void,
  setPrinterBusy: (printerBusy: boolean) => void,
  setPrinterData: (printerData: PrinterInfo | null) => void,
  setPrinterFunctions: (printerFunctions: PrinterFunction[]) => void,
  setShowSerials: (showSerials: boolean) => void,
  setSyncBusy: (syncBusy: boolean) => void,
  setSyncSelect: (syncBusy: boolean) => void,
  showTrashCount: (show: boolean) => void,
  updateTrashCount: (frames: number, images: number) => void,
  setVideoSelection: (videoSelection: string[]) => void,
}

export type InteractionsState = Values & Actions;

const useInteractionsStore = create<InteractionsState>((set, get) => ({
  downloadHashes: [],
  dragover: false,
  errors: [],
  isFullscreen: false,
  lightboxImage: null,
  printerBusy: false,
  printerData: null,
  printerFunctions: [],
  showSerials: false,
  syncBusy: false,
  syncSelect: false,
  trashCount: { frames: 0, images: 0, show: false },
  videoSelection: [],

  dismissError: (index: number) => set({ errors: get().errors.filter((_, i) => i !== index) }),
  setDownloadHashes: (downloadHashes: string[]) => set({ downloadHashes }),
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

  setLightboxImage: (lightboxImage: number | null) => {
    if (lightboxImage === null) {
      if (screenfull.isEnabled) {
        screenfull.exit();
      }
    }

    set({ lightboxImage });
  },
}));

export default useInteractionsStore;
