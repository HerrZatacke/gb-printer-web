import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../../Lightbox';
import useQuestions from '../../../../hooks/useQuestions';
import Select from './types/Select';
import Input from '../../Input';
import InfoText from '../../InfoText';

const Confirm = ({
  message,
  questions: questionsProp,
  confirm,
  deny,
}) => {
  const [questions, values, setSelected] = useQuestions(questionsProp);

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

Confirm.propTypes = {
  message: PropTypes.string.isRequired,
  questions: PropTypes.func,
  confirm: PropTypes.func.isRequired,
  deny: PropTypes.func,
};

Confirm.defaultProps = {
  questions: () => [],
  deny: null,
};

export default Confirm;
