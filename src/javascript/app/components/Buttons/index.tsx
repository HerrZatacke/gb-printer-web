import React from 'react';
import './index.scss';

interface Props {
  confirm?: () => void,
  deny?: () => void,
  canConfirm?: boolean,
}

const Buttons = ({ confirm, deny, canConfirm }: Props) => (
  <div className="buttons">
    { deny ? (
      <button
        className="buttons__button buttons__button--deny"
        type="button"
        onClick={deny}
      >
        Cancel
      </button>
    ) : null }
    { confirm ? (
      <button
        disabled={canConfirm === false}
        className="buttons__button buttons__button--confirm"
        type="button"
        onClick={confirm}
      >
        Ok
      </button>
    ) : null }
  </div>
);

export default Buttons;
