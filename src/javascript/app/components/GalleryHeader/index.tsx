import React from 'react';
import classnames from 'classnames';
import GalleryViewSelect from '../GalleryViewSelect';
import BatchButtons from '../BatchButtons';
import './index.scss';

interface Props {
  page: number,
  isSticky?: boolean,
  isBottom?: boolean,
}

function GalleryHeader(props: Props) {
  return (
    <div
      className={classnames('gallery-header', {
        'gallery-header--sticky': props.isSticky,
        'gallery-header--bottom': props.isBottom,
      })}
    >
      <GalleryViewSelect />
      <BatchButtons page={props.page} />
    </div>
  );
}

export default GalleryHeader;
