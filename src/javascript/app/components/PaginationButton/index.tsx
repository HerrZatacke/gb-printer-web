import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import './index.scss';
import { useGalleryParams } from '../../../hooks/useGalleryParams';

interface Props {
  children: React.ReactNode,
  active?: boolean,
  page: number,
  title: string,
}

function PaginationButton(props: Props) {
  const { path } = useGalleryParams();

  return (
    <li
      className={classNames('gallery-button pagination__button', {
        'gallery-button--selected': props.active,
      })}
    >
      <NavLink
        className="pagination__link"
        to={`/gallery/${path}page/${props.page + 1}`}
        title={props.title}
      >
        {props.children}
      </NavLink>
    </li>
  );
}

export default PaginationButton;
