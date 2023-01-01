import React from 'react';
import { useSelector } from 'react-redux';
import './index.scss';

const DragOver = () => {
  const dragover = useSelector((state) => state.dragover);
  return (
    dragover ? (
      <div className="drag-over" />
    ) : null
  );
};

export default DragOver;
