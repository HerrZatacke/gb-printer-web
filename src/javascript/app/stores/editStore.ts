import { create } from 'zustand';
import type { CurrentEditBatch } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';
import type { PickColors } from '../../../types/PickColors';
import type { EditGroupInfo } from '../../../types/actions/GroupActions';

interface Values {
  editFrame: string | null,
  editPalette: Palette | null,
  pickColors: PickColors | null,
  editImageGroup: EditGroupInfo | null,
  editImages: CurrentEditBatch | null,
  editRGBNImages: string[],
}

interface Actions {
  setEditFrame: (editFrame: string) => void,
  setEditImageGroup: (editImageGroup: EditGroupInfo) => void,
  setEditPalette: (palette: Palette) => void,
  setEditRGBNImages: (editRGBNImages: string[]) => void,
  setPickColors: (pickColors: PickColors) => void,
  setEditImages: (editImages: CurrentEditBatch) => void,
  cancelEditFrame: () => void,
  cancelEditImageGroup: () => void,
  cancelEditPalette: () => void,
  cancelEditRGBNImages: () => void,
  cancelPickColors: () => void,
  cancelEditImages: () => void,
}

export type EditState = Values & Actions;

const useEditStore = create<EditState>((set) => ({
  editFrame: null,
  editPalette: null,
  pickColors: null,
  editImageGroup: null,
  editImages: null,
  editRGBNImages: [],

  setEditFrame: (editFrame: string) => set({ editFrame }),
  setEditImageGroup: (editImageGroup: EditGroupInfo) => set({ editImageGroup }),
  setEditPalette: (editPalette: Palette) => set({ editPalette, pickColors: null }),
  setEditRGBNImages: (editRGBNImages: string[]) => set({ editRGBNImages }),
  setPickColors: (pickColors: PickColors) => set({ pickColors }),
  setEditImages: (editImages: CurrentEditBatch) => set({ editImages }),
  cancelEditFrame: () => set({ editFrame: null }),
  cancelEditImageGroup: () => set({ editImageGroup: null }),
  cancelEditPalette: () => set({ editPalette: null }),
  cancelEditRGBNImages: () => set({ editRGBNImages: [] }),
  cancelPickColors: () => set({ pickColors: null }),
  cancelEditImages: () => set({ editImages: null }),
}));

export default useEditStore;
