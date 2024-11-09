import { create } from 'zustand';

interface Values {
  editFrame: string | null,
}

interface Actions {
  setEditFrame: (editFrame: string) => void,
  cancelEditFrame: () => void,
}

export type EditState = Values & Actions;

const useEditStore = create<EditState>((set) => ({
  editFrame: null,
  setEditFrame: (editFrame: string) => set({ editFrame }),
  cancelEditFrame: () => set({ editFrame: null }),
}));

export default useEditStore;
