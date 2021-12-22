import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import GalleryViewSelect from '../GalleryViewSelect';
import Pagination from '../Pagination';
import BatchButtons from '../BatchButtons';

const GalleryHeader = (props) => (
  <div className={classnames('gallery-header', { 'gallery-header--sticky': props.isSticky })}>
    <GalleryViewSelect />
    <Pagination page={props.page} />
    <BatchButtons page={props.page} />
  </div>
);

GalleryHeader.propTypes = {
  page: PropTypes.number.isRequired,
  isSticky: PropTypes.bool,
};

GalleryHeader.defaultProps = {
  isSticky: false,
};

export default GalleryHeader;
