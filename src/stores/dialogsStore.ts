import { create } from 'zustand';
import type { Dialog } from '@/types/Dialog';

interface Values {
  dialogs: Dialog[],
}

interface Actions {
  setDialog: (dialog: Dialog) => void,
  dismissDialog: (index: number) => void,
}

export type DialogsState = Values & Actions;

const useDialogsStore = create<DialogsState>((set) => ({
  dialogs: [],
  dismissDialog: (index: number) => set(({ dialogs }) => ({ dialogs: dialogs.filter((_, i) => index !== i) })),
  setDialog: (dialog: Dialog) => set(({ dialogs }) => ({ dialogs: [dialog, ...dialogs] })),
}));

export default useDialogsStore;
