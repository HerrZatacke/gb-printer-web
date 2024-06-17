import React from 'react';
import classnames from 'classnames';
import Lightbox from '../../Lightbox';
import useDialog from '../../../../hooks/useDialog';
import Select from './fields/Select';
import Input, { InputType } from '../../Input';
import InfoText from './fields/InfoText';
import SVG from '../../SVG';
import './index.scss';
import type { DialogQuestionCheckbox,
  DialogQuestionInfo,
  DialogQuestionNumber,
  DialogQuestionSelect,
  DialogQuestionText } from '../../../../../types/Dialog';
import {
  DialoqQuestionType,
} from '../../../../../types/Dialog';

function Confirm() {

  const { message, questions, values, setSelected, confirm, deny } = useDialog();

  return (
    <Lightbox
      className="confirm"
      confirm={confirm}
      deny={deny}
      header={message}
    >
      {
        questions.map((question) => {
          switch (question.type) {
            case DialoqQuestionType.SELECT: {
              const { label, key, options, disabled = false } = question as DialogQuestionSelect;
              return (
                <Select
                  key={key}
                  id={key}
                  disabled={disabled}
                  value={values[key] as string || ''}
                  label={label}
                  options={options}
                  setSelected={(value) => setSelected({ [key]: value })}
                />
              );
            }

            case DialoqQuestionType.TEXT: {
              const { label, key, disabled = false } = question as DialogQuestionText;
              return (
                <Input
                  key={key}
                  id={key}
                  disabled={disabled}
                  value={values[key] as string || ''}
                  type={InputType.TEXT}
                  labelText={label}
                  onChange={(update) => setSelected({ [key]: update })}
                />
              );
            }

            case DialoqQuestionType.NUMBER: {
              const { label, key, min, max, disabled = false } = question as DialogQuestionNumber;
              return (
                <Input
                  key={key}
                  id={key}
                  disabled={disabled}
                  value={values[key] as string || ''}
                  type={InputType.NUMBER}
                  labelText={label}
                  min={min}
                  max={max}
                  onChange={(update) => setSelected({ [key]: update })}
                />
              );
            }

            case DialoqQuestionType.CHECKBOX: {
              const { label, key, disabled = false } = question as DialogQuestionCheckbox;

              return (
                <label
                  key={key}
                  id={key}
                  className={
                    classnames('confirm__check-label', {
                      'confirm__check-label--checked': values[key],
                    })
                  }
                >
                  <input
                    type="checkbox"
                    className="confirm__checkbox"
                    checked={values[key] as boolean}
                    disabled={disabled}
                    onChange={({ target }) => {
                      setSelected({ [key]: target.checked });
                    }}
                  />
                  <SVG name="checkmark" />
                  <span className="confirm__check-label-text">
                    {label}
                  </span>
                </label>
              );
            }

            case DialoqQuestionType.INFO: {
              const { label, key, themes } = question as DialogQuestionInfo;
              return (
                <InfoText
                  label={label}
                  themes={themes}
                  key={key}
                />
              );
            }

            default:
              return null;
          }
        }).filter(Boolean)
      }
    </Lightbox>
  );
}

export default Confirm;
