import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import './index.scss';

interface Props {
  children: React.ReactNode,
  active?: boolean,
  page: number,
  title: string,
}

function PaginationButton(props: Props) {
  return (
    <li
      className={classNames('gallery-button pagination__button', {
        'gallery-button--selected': props.active,
      })}
    >
      <NavLink
        className="pagination__link"
        to={`/gallery/page/${props.page + 1}`}
        title={props.title}
      >
        {props.children}
      </NavLink>
    </li>
  );
}

export default PaginationButton;
