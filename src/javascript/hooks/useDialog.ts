import { useState } from 'react';
import useDialogsStore from '../app/stores/dialogsStore';
import type {
  Dialog,
  DialogQuestion,
  DialogQuestionSelect,
  DialogResult,
  DialogQuestionText,
} from '../../types/Dialog';
import {
  DialoqQuestionType,
} from '../../types/Dialog';

export interface UseDialog {
  message: string,
  confirm: () => Promise<void>,
  deny?: () => Promise<void>,
  questions: DialogQuestion[],
  values: DialogResult,
  setSelected: (result: DialogResult) => void,
}

const getInitialValues = (questions?: (values: DialogResult) => DialogQuestion[]): DialogResult => {
  if (!questions) {
    return {};
  }

  return (
    questions({})
      .reduce((acc, question: DialogQuestion) => {
        const { key } = question;
        let initialValue;

        switch (question.type) {
          case DialoqQuestionType.SELECT: {
            const selectQuestion = { ...question } as DialogQuestionSelect;
            initialValue = selectQuestion.options?.find(({ selected }) => selected)?.value || '';
            break;
          }

          case DialoqQuestionType.CHECKBOX: {
            initialValue = false;
            break;
          }

          case DialoqQuestionType.TEXT:
            initialValue = (question as DialogQuestionText).initialValue || '';
            break;

          case DialoqQuestionType.NUMBER:
            initialValue = 0;
            break;

          case DialoqQuestionType.INFO:
          default:
            return acc;
        }

        return ({
          ...acc,
          [key]: initialValue,
        });
      }, {})
  );
};

const useDialog = (): UseDialog => {
  const { dialogs } = useDialogsStore();
  const dialog: Dialog = dialogs[0];
  const {
    questions,
  } = dialog;

  const [values, setValues] = useState<DialogResult>(getInitialValues(questions));

  return {
    message: dialog.message,
    confirm: () => dialog.confirm(values),
    deny: dialog.deny,
    questions: questions ? questions(values) : [],
    values,
    setSelected: (result: DialogResult) => {
      setValues({
        ...values,
        ...result,
      });
    },
  };
};

export default useDialog;
