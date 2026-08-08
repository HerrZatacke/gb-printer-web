import { GridSize, ResponsiveStyleValue } from '@mui/system';
import { ComponentType } from 'react';

export interface FlyoutContent {
  headline: string;
  navItems: NavItem[];
  sizeFlyout: ResponsiveStyleValue<GridSize>;
}

export interface NavItem {
  label: string;
  route: string;
  children?: FlyoutContent[];
}

export const NavBadgeColor = {
  ERROR: 'error',
  INFO: 'info',
  DEFAULT: 'default',
} as const;
export type NavBadgeColor = (typeof NavBadgeColor)[keyof typeof NavBadgeColor];

export interface NavActionItem {
  title: string;
  Icon: ComponentType;
  badgeContent: string | null;
  badgeColor: NavBadgeColor;
  onClick: () => void;
  disabled: boolean;
  isBusy: boolean;
}
