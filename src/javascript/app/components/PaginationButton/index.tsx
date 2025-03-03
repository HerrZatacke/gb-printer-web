import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router';
import { useGalleryParams } from '../../../hooks/useGalleryParams';

export interface Props {
  children: React.ReactNode,
  disabled: boolean,
  page: number,
}

function PaginationButton(props: Props) {
  const { path } = useGalleryParams();

  return (
    <li
      className={classNames('gallery-button pagination__button', {
        'gallery-button--disabled': props.disabled,
        'gallery-button--selected': !props.disabled,
      })}
    >
      { props.disabled ? (
        <button
          className="pagination__link"
          type="button"
          disabled
        >
          {props.children}
        </button>
      ) : (
        <NavLink
          className="pagination__link"
          to={`/gallery/${path}page/${props.page + 1}`}
          title={`To page ${props.page + 1}`}
        >
          {props.children}
        </NavLink>
      ) }
    </li>
  );
}

export default PaginationButton;
