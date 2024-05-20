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

export interface DialogQuestionBase {
  type: DialoqQuestionType,
  label: string,
  key: string,
}

export interface DialogQuestionText extends DialogQuestionBase {
  type: DialoqQuestionType.TEXT,
  disabled?: boolean,
}

export interface DialogQuestionNumber extends DialogQuestionBase {
  type: DialoqQuestionType.NUMBER,
  min: number,
  max: number,
  disabled?: boolean,
}

export interface DialogQuestionSelect extends DialogQuestionBase {
  type: DialoqQuestionType.SELECT,
  options: DialogOption[],
  disabled?: boolean,
}

export interface DialogQuestionCheckbox extends DialogQuestionBase {
  type: DialoqQuestionType.CHECKBOX,
  disabled?: boolean,
}

export interface DialogQuestionInfo extends DialogQuestionBase {
  type: DialoqQuestionType.INFO,
  themes: string[]
}

export type DialogQuestion =
  DialogQuestionCheckbox |
  DialogQuestionText |
  DialogQuestionSelect |
  DialogQuestionInfo |
  DialogQuestionNumber;

export interface Dialog {
  message: string,
  questions?: (values?: DialogResult) => DialogQuestion[],
  confirm: () => Promise<void>,
  deny: () => Promise<void>,
}
