import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../../Lightbox';
import useQuestions from './useQuestions';

const Confirm = ({
  message,
  questions: questionsProp,
  confirm,
  deny,
}) => {
  const [questions, selected, setSelected] = useQuestions(questionsProp);

  return (
    <Lightbox
      className="confirm"
      confirm={() => confirm(selected)}
      deny={deny}
      header={message}
    >
      {
        questions.map(({ label, key, options }) => (
          options && options.length > 1 && (
            <div
              key={key}
              className="inputgroup"
            >
              <label htmlFor={`confirm-options-${key}`} className="inputgroup__label">
                {label}
              </label>
              <select
                id={`confirm-options-${key}`}
                className="inputgroup__input inputgroup__input--select"
                value={selected[key]}
                onChange={({ target: { value } }) => {
                  setSelected(key, value);
                }}
              >
                {
                  options.map(({ value, name }) => (
                    <option
                      value={value}
                      key={value}
                    >
                      {name}
                    </option>
                  ))
                }
              </select>
            </div>
          )
        ))
      }
    </Lightbox>
  );
};

Confirm.propTypes = {
  message: PropTypes.string.isRequired,
  questions: PropTypes.array,
  confirm: PropTypes.func.isRequired,
  deny: PropTypes.func.isRequired,
};

Confirm.defaultProps = {
  questions: [],
};

export default Confirm;
