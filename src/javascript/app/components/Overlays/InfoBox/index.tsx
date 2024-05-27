import React from 'react';
import Lightbox from '../../Lightbox';

import './index.scss';
import { useFrameInfo } from './useFrameInfo';

const InfoBox = () => {

  const { message, dismiss } = useFrameInfo();

  return (
    message ? (
      <Lightbox
        className="info-box"
        confirm={() => dismiss()}
        header={message.headline}
      >
        <div className="info-box__message">
          {message.text.map((text, index) => <p key={index}>{text}</p>)}
        </div>
      </Lightbox>
    ) : null
  );
};

export default InfoBox;
