import React from 'react';
import GalleryViewSelect from '../GalleryViewSelect';
import Pagination from '../Pagination';
import BatchButtons from '../BatchButtons';

const GalleryHeader = () => (
  <div className="gallery-header">
    <GalleryViewSelect />
    <Pagination />
    <BatchButtons />
  </div>
);

export default GalleryHeader;
