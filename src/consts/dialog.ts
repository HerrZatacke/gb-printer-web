export const DialoqQuestionType = {
  CHECKBOX: 'checkbox',
  SELECT: 'select',
  TEXT: 'text',
  NUMBER: 'number',
  INFO: 'info',
  IMAGE: 'image',
  META: 'meta',
} as const;
export type DialoqQuestionType = (typeof DialoqQuestionType)[keyof typeof DialoqQuestionType];
