import type { MenuOption } from '@/types/MenuOption';

export enum GalleryClickAction {
  SELECT = 'select',
  EDIT = 'edit',
  VIEW = 'view',
}

export type ClickActionOption = MenuOption<GalleryClickAction>;


export const clickActionMenuOptions: ClickActionOption[] = [
  {
    label: 'Click selects the item',
    value: GalleryClickAction.SELECT,
  },
  {
    label: 'Click opens edit dialog',
    value: GalleryClickAction.EDIT,
  },
  {
    label: 'Click opens the item in lightbox',
    value: GalleryClickAction.VIEW,
  },
];
