import React from 'react';
import { useSelector } from 'react-redux';
import './index.scss';
import type { State } from '../../../store/State';

function DragOver() {
  const dragover = useSelector((state: State) => state.dragover);
  return (
    dragover ? (
      <div className="drag-over" />
    ) : null
  );
}

export default DragOver;
