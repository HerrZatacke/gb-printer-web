import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Lightbox from '../../Lightbox';
import ImportRow from './ImportRow';
import { IMPORTQUEUE_CANCEL } from '../../../store/actions';
import './index.scss';

const ImportQueue = () => {
  const importQueue = useSelector((store) => store.importQueue);
  const dispatch = useDispatch();

  return (
    <Lightbox
      className="import-overlay"
      header="Image Import"
      confirm={() => {}}
      deny={() => {
        dispatch({ type: IMPORTQUEUE_CANCEL });
      }}
    >
      <div
        className="import-overlay__content"
      >
        <ul
          className="import-overlay__images"
        >
          {
            importQueue.map((image, index) => (
              <ImportRow
                key={index}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...image}
              />
            ))
          }
        </ul>
      </div>
    </Lightbox>
  );
};

export default ImportQueue;
