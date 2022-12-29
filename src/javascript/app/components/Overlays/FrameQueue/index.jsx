import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Lightbox from '../../Lightbox';
import { FRAMEQUEUE_CANCEL_ONE } from '../../../store/actions';
import './index.scss';

const FrameQueue = () => {
  const frame = useSelector((store) => store.frameQueue[0]);
  const dispatch = useDispatch();

  return (
    <Lightbox
      className="import-overlay"
      header={`Import Frame "${frame.fileName}"`}
      confirm={() => {}}
      deny={() => {
        dispatch({
          type: FRAMEQUEUE_CANCEL_ONE,
          payload: frame.tempId,
        });
      }}
    >
      <div
        className="import-overlay__content"
      >
        <pre>
          ay
        </pre>
      </div>
    </Lightbox>
  );
};

export default FrameQueue;
