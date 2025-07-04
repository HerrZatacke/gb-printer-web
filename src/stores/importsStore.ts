import { create } from 'zustand';
import type { ImportItem } from '@/types/ImportItem';
import type { QueueImage } from '@/types/QueueImage';

interface Values {
  bitmapQueue: QueueImage[],
  frameQueue: ImportItem[],
  importQueue: ImportItem[],
}

interface Actions {
  bitmapQueueAdd: (queueImages: QueueImage[]) => void,
  bitmapQueueCancel: () => void,
  frameQueueAdd: (importItems: ImportItem[]) => void,
  frameQueueCancelOne: (tempId: string) => void,
  importQueueAdd: (importItems: ImportItem[]) => void,
  importQueueCancel: () => void,
  importQueueCancelOne: (tempId: string) => void,
  getImportItem: (tempId: string) => ImportItem | null,
}

export type ImportsState = Values & Actions;

const useImportsStore = create<ImportsState>((set, get) => ({
  bitmapQueue: [],
  frameQueue: [],
  importQueue: [],

  bitmapQueueAdd: (queueImages: QueueImage[]) => set(({ bitmapQueue }) => (
    { bitmapQueue: [...bitmapQueue, ...queueImages] }
  )),
  bitmapQueueCancel: () => set({ bitmapQueue: [] }),

  frameQueueAdd: (importItems: ImportItem[]) => set(({ frameQueue }) => (
    { frameQueue: [...frameQueue, ...importItems] }
  )),
  frameQueueCancelOne: (tempId: string) => set(({ frameQueue }) => (
    { frameQueue: frameQueue.filter((item) => item.tempId !== tempId) }
  )),

  importQueueAdd: (importItems: ImportItem[]) => {
    const { bitmapQueue, importQueue } = get();
    const fileNames = importItems.map(({ fileName }) => fileName);
    set({
      bitmapQueue: bitmapQueue.filter(({ fileName }) => (
        !fileNames.includes(fileName)
      )),
      importQueue: [...importQueue, ...importItems],
    });
  },
  importQueueCancel: () => {
    set({ importQueue: [] });
  },
  importQueueCancelOne: (tempId: string) => set(({ importQueue }) => (
    { importQueue: importQueue.filter((item) => item.tempId !== tempId) }
  )),
  getImportItem: (tempId: string): ImportItem | null => {
    const { importQueue } = get();
    return importQueue.find((item) => item.tempId === tempId) || null;
  },
}));

export default useImportsStore;
