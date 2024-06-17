import React from 'react';
import classnames from 'classnames';
import GalleryViewSelect from '../GalleryViewSelect';
import Pagination from '../Pagination';
import BatchButtons from '../BatchButtons';
import './index.scss';

interface Props {
  page: number,
  isSticky?: boolean,
  isBottom?: boolean,
}

const GalleryHeader = (props: Props) => (
  <div
    className={classnames('gallery-header', {
      'gallery-header--sticky': props.isSticky,
      'gallery-header--bottom': props.isBottom,
    })}
  >
    <GalleryViewSelect />
    <Pagination page={props.page} />
    <BatchButtons page={props.page} />
  </div>
);

export default GalleryHeader;
