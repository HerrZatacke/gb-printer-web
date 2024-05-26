import React from 'react';
import { useSelector } from 'react-redux';
import './index.scss';
import { State } from '../../../store/State';

const DragOver = () => {
  const dragover = useSelector((state: State) => state.dragover);
  return (
    dragover ? (
      <div className="drag-over" />
    ) : null
  );
};

export default DragOver;
