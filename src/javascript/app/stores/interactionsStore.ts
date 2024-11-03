import { create } from 'zustand';
import type { ErrorMessage } from '../components/Errors/useErrors';
import type { ProgressLog } from '../../../types/actions/LogActions';
import type { Progress } from '../store/reducers/progressReducer';
import type { TrashCount } from '../store/reducers/trashCountReducer';

interface Values {
  dragover: boolean,
  isFullscreen: boolean,
  errors: ErrorMessage[],
  syncBusy: boolean,
  lightboxImage: number | null,
  progressLog: ProgressLog,
  progress: Progress,
  trashCount: TrashCount,
}

interface Actions {
  setDragover: (dragover: boolean) => void,
  setIsFullscreen: (isFullscreen: boolean) => void,
}

export type InteractionsState = Values & Actions;

const useInteractionsStore = create<InteractionsState>((set) => ({
  dragover: false,
  isFullscreen: false,
  errors: [],
  syncBusy: false,
  lightboxImage: null,
  progressLog: { git: [], dropbox: [] },
  progress: { gif: 0, printer: 0, plugin: 0 },
  trashCount: { frames: 0, images: 0, show: false },

  setDragover: (dragover: boolean) => set({ dragover }),
  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),
}));

export default useInteractionsStore;
