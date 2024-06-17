import { InfoTextTheme } from '../javascript/app/components/Overlays/Confirm/fields/InfoText';

export enum DialoqQuestionType {
  CHECKBOX = 'checkbox',
  SELECT = 'select',
  TEXT = 'text',
  NUMBER = 'number',
  INFO = 'info',
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
  themes: InfoTextTheme[]
}

export interface Dialog {
  message: string,
  questions?: (values: DialogResult) => DialogQuestion[],
  confirm: (values: DialogResult) => Promise<void>,
  deny?: () => Promise<void>,
}
