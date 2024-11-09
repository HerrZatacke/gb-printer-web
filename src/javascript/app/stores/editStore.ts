import { create } from 'zustand';
import type { Palette } from '../../../types/Palette';

interface Values {
  editFrame: string | null,
  editPalette: Palette | null,
}

interface Actions {
  setEditFrame: (editFrame: string) => void,
  setEditPalette: (palette: Palette) => void,
  cancelEditFrame: () => void,
  cancelEditPalette: () => void,
}

export type EditState = Values & Actions;

const useEditStore = create<EditState>((set) => ({
  editFrame: null,
  editPalette: null,
  setEditFrame: (editFrame: string) => set({ editFrame }),
  setEditPalette: (editPalette: Palette) => set({ editPalette }),
  cancelEditFrame: () => set({ editFrame: null }),
  cancelEditPalette: () => set({ editPalette: null }),
}));

export default useEditStore;
