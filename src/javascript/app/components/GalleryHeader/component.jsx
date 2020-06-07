import React from 'react';
import PropTypes from 'prop-types';
import GalleryViewSelect from '../GalleryViewSelect';
import Pagination from '../Pagination';
import BatchButtons from '../BatchButtons';

const GalleryHeader = (props) => (
  <div className="gallery-header">
    <GalleryViewSelect />
    <Pagination page={props.page} />
    <BatchButtons page={props.page} />
  </div>
);

GalleryHeader.propTypes = {
  page: PropTypes.number.isRequired,
};

export default GalleryHeader;
