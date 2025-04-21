import type { AlertColor } from '@mui/material';
import type { MetaProps } from '../javascript/app/components/MetaTable';

export enum DialoqQuestionType {
  CHECKBOX = 'checkbox',
  SELECT = 'select',
  TEXT = 'text',
  NUMBER = 'number',
  INFO = 'info',
  IMAGE = 'image',
  META = 'meta',
}

export type DialogResultValue = string | number | boolean;
export type DialogResult = Record<string, DialogResultValue>;

export interface DialogOption {
  value: string,
  name: string,
  selected?: boolean,
}

export interface DialogQuestion {
  type: DialoqQuestionType,
  label: string,
  key: string,
}

export interface DialogQuestionText extends DialogQuestion {
  type: DialoqQuestionType.TEXT,
  initialValue?: string,
  disabled?: boolean,
}

export interface DialogQuestionNumber extends DialogQuestion {
  type: DialoqQuestionType.NUMBER,
  min: number,
  max: number,
  disabled?: boolean,
}

export interface DialogQuestionSelect extends DialogQuestion {
  type: DialoqQuestionType.SELECT,
  options: DialogOption[],
  disabled?: boolean,
}

export interface DialogQuestionCheckbox extends DialogQuestion {
  type: DialoqQuestionType.CHECKBOX,
  disabled?: boolean,
}

export interface DialogQuestionInfo extends DialogQuestion {
  type: DialoqQuestionType.INFO,
  severity: AlertColor,
}

export interface DialogQuestionImage extends DialogQuestion {
  type: DialoqQuestionType.IMAGE,
  src: string,
}

export interface DialogQuestionMeta extends DialogQuestion {
  type: DialoqQuestionType.META,
  meta: MetaProps,
}

export interface Dialog {
  message: string,
  questions?: (values: DialogResult) => DialogQuestion[],
  confirm: (values: DialogResult) => Promise<void>,
  deny?: () => Promise<void>,
}
