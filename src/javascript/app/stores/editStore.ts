import { create } from 'zustand';
import type { Palette } from '../../../types/Palette';
import type { PickColors } from '../../../types/PickColors';

interface Values {
  editFrame: string | null,
  editPalette: Palette | null,
  pickColors: PickColors | null,
  editRGBNImages: string[],
}

interface Actions {
  setEditFrame: (editFrame: string) => void,
  setEditPalette: (palette: Palette) => void,
  setEditRGBNImages: (editRGBNImages: string[]) => void,
  setPickColors: (pickColors: PickColors) => void,
  cancelEditFrame: () => void,
  cancelEditPalette: () => void,
  cancelEditRGBNImages: () => void,
  cancelPickColors: () => void,
}

export type EditState = Values & Actions;

const useEditStore = create<EditState>((set) => ({
  editFrame: null,
  editPalette: null,
  pickColors: null,
  editRGBNImages: [],

  setEditFrame: (editFrame: string) => set({ editFrame }),
  setEditPalette: (editPalette: Palette) => set({ editPalette, pickColors: null }),
  setEditRGBNImages: (editRGBNImages: string[]) => set({ editRGBNImages }),
  setPickColors: (pickColors: PickColors) => set({ pickColors }),
  cancelEditFrame: () => set({ editFrame: null }),
  cancelEditPalette: () => set({ editPalette: null }),
  cancelEditRGBNImages: () => set({ editRGBNImages: [] }),
  cancelPickColors: () => set({ pickColors: null }),
}));

export default useEditStore;
