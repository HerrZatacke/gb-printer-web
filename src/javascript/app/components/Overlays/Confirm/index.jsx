import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import Lightbox from '../../Lightbox';
import useQuestions from '../../../../hooks/useQuestions';
import Select from './types/Select';
import Input from '../../Input';
import InfoText from '../../InfoText';
import SVG from '../../SVG';
import './index.scss';

const Confirm = () => {
  const {
    message,
    questionsState,
    confirm,
    deny,
  } = useSelector((state) => {
    const toConfirm = state.confirm[0];
    if (!toConfirm) {
      return {};
    }

    return ({
      message: toConfirm.message,
      questionsState: toConfirm.questions || (() => ([])),
      confirm: toConfirm.confirm,
      deny: toConfirm?.deny,
    });
  });

  const [questions, values, setSelected] = useQuestions(questionsState);

  const notComplete = questions.find(({ type }) => type === 'confirmForm')?.notComplete;

  return (
    <Lightbox
      className="confirm"
      confirm={notComplete ? null : () => confirm(values)}
      deny={deny}
      header={message}
    >
      {
        questions.map(({ label, key, type, options, disabled = false, themes = [], min, max }) => {
          switch (type) {
            case 'select':
              return (
                <Select
                  key={key}
                  id={key}
                  disabled={disabled}
                  value={values[key] || ''}
                  label={label}
                  options={options}
                  setSelected={({ target: { value } }) => {
                    setSelected(key, value);
                  }}
                />
              );
            case 'text':
            case 'number':
              return (
                <Input
                  key={key}
                  id={key}
                  disabled={disabled}
                  value={values[key] || ''}
                  type={type}
                  labelText={label}
                  min={min}
                  max={max}
                  onChange={(update) => {
                    setSelected(key, update);
                  }}
                />
              );
            case 'checkbox':
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
                    checked={values[key]}
                    disabled={disabled}
                    onChange={({ target }) => {
                      setSelected(key, target.checked);
                    }}
                  />
                  <SVG name="checkmark" />
                  <span className="confirm__check-label-text">
                    { label }
                  </span>
                </label>
              );
            case 'info':
              return (
                <InfoText
                  label={label}
                  themes={themes}
                  key={key}
                />
              );
            default:
              return null;
          }
        }).filter(Boolean)
      }
    </Lightbox>
  );
};

export default Confirm;
