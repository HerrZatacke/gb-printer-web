import React from 'react';
import './index.scss';
import useInteractionsStore from '../../../stores/interactionsStore';

function DragOver() {
  const { dragover } = useInteractionsStore();
  return (
    dragover ? (
      <div className="drag-over" />
    ) : null
  );
}

export default DragOver;
