import { ComponentType } from 'react';

export interface NavItem {
  label: string,
  route: string,
}

export enum NavBadgeColor {
  ERROR = 'error',
  INFO = 'info',
  DEFAULT = 'default',
}


export interface NavActionItem {
  title: string,
  Icon: ComponentType,
  badgeContent: string | null,
  badgeColor: NavBadgeColor,
  onClick: () => void,
  disabled: boolean,
  isBusy: boolean,
}
