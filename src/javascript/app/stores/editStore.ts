import { create } from 'zustand';
import type { Palette } from '../../../types/Palette';
import type { PickColors } from '../../../types/PickColors';

interface Values {
  editFrame: string | null,
  editPalette: Palette | null,
  pickColors: PickColors | null,
}

interface Actions {
  setEditFrame: (editFrame: string) => void,
  setEditPalette: (palette: Palette) => void,
  setPickColors: (pickColors: PickColors) => void,
  cancelEditFrame: () => void,
  cancelEditPalette: () => void,
  cancelPickColors: () => void,
}

export type EditState = Values & Actions;

const useEditStore = create<EditState>((set) => ({
  editFrame: null,
  editPalette: null,
  pickColors: null,

  setEditFrame: (editFrame: string) => set({ editFrame }),
  setEditPalette: (editPalette: Palette) => set({ editPalette, pickColors: null }),
  setPickColors: (pickColors: PickColors) => set({ pickColors }),
  cancelEditFrame: () => set({ editFrame: null }),
  cancelEditPalette: () => set({ editPalette: null }),
  cancelPickColors: () => set({ pickColors: null }),
}));

export default useEditStore;
