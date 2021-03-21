import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../../Lightbox';

const Confirm = ({
  message,
  options,
  confirm,
  deny,
}) => {
  const [selectedOption, setSelectedOption] = useState(options.find(({ selected }) => selected).value);

  return (
    <Lightbox
      className="confirm"
      confirm={() => confirm(selectedOption)}
      deny={deny}
      header={message}
    >
      {options && options.length > 1 && (
        <div className="inputgroup">
          <select
            id="confirm-options"
            className="inputgroup__input inputgroup__input--select"
            value={selectedOption}
            onChange={({ target: { value } }) => {
              setSelectedOption(value);
            }}
          >
            {
              options.map(({ value, label }) => (
                <option
                  value={value}
                  key={value}
                >
                  {label}
                </option>
              ))
            }
          </select>
        </div>
      )}
    </Lightbox>
  );
};

Confirm.propTypes = {
  message: PropTypes.string.isRequired,
  options: PropTypes.array,
  confirm: PropTypes.func.isRequired,
  deny: PropTypes.func.isRequired,
};

Confirm.defaultProps = {
  options: [],
};

export default Confirm;
