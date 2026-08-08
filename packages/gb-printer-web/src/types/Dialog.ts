import { type AlertColor } from '@mui/material';
import { type MetaProps } from '@/components/MetaTable';
import { type DialoqQuestionType } from '@/consts/dialog';
export type DialogResultValue = string | number | boolean;
export type DialogResult = Record<string, DialogResultValue>;

export interface DialogOption {
  value: string;
  name: string;
  selected?: boolean;
}

export interface DialogQuestion {
  type: DialoqQuestionType;
  label: string;
  key: string;
}

export interface DialogQuestionText extends DialogQuestion {
  type: typeof DialoqQuestionType.TEXT;
  initialValue?: string;
  disabled?: boolean;
}

export interface DialogQuestionNumber extends DialogQuestion {
  type: typeof DialoqQuestionType.NUMBER;
  min: number;
  max: number;
  disabled?: boolean;
}

export interface DialogQuestionSelect extends DialogQuestion {
  type: typeof DialoqQuestionType.SELECT;
  options: DialogOption[];
  disabled?: boolean;
}

export interface DialogQuestionCheckbox extends DialogQuestion {
  type: typeof DialoqQuestionType.CHECKBOX;
  disabled?: boolean;
}

export interface DialogQuestionInfo extends DialogQuestion {
  type: typeof DialoqQuestionType.INFO;
  severity: AlertColor;
}

export interface DialogQuestionImage extends DialogQuestion {
  type: typeof DialoqQuestionType.IMAGE;
  src: string;
}

export interface DialogQuestionMeta extends DialogQuestion {
  type: typeof DialoqQuestionType.META;
  meta: MetaProps;
}

export interface Dialog {
  message: string;
  questions?: (values: DialogResult) => DialogQuestion[];
  confirm: (values: DialogResult) => Promise<void>;
  deny?: () => Promise<void>;
}
