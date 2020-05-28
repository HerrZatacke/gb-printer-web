import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PaginationButton from '../PaginationButton';
import SVG from '../SVG';

const Pagination = (props) => {

  if (props.totalPages < 2) {
    return null;
  }

  const pages = [...new Array(props.totalPages)].map((undef, index) => index);
  const { setCurrentPage, currentPage } = props;

  const displayedPages = pages.map((page) => {
    switch (page) {
      // first, current, before/after current and lastpage
      case 0:
      case currentPage - 1:
      case currentPage:
      case currentPage + 1:
      case pages.length - 1:
        return (
          <PaginationButton
            key={page}
            page={page}
            className={classNames('pagination__list-item pagination__list-item--page', {
              'pagination__list-item--page--active': page === currentPage,
            })}
            title={`To page ${page + 1}`}
            disabled={page === currentPage}
            action={() => {
              setCurrentPage(page);
            }}
          >
            {page + 1}
          </PaginationButton>
        );
      // ellipsis to indicate left out pages
      case currentPage - 2:
      case currentPage + 2:
        return <li key={page} className="pagination__list-item pagination__list-item--ellipsis" />;
      default:
        return null;
    }
  });

  if (currentPage > 0) {
    displayedPages.unshift((
      <PaginationButton
        key="back"
        className="pagination__list-item pagination__list-item--prevnext pagination__list-item--prevnext-prev"
        title="To previous page"
        disabled={currentPage < 1}
        action={() => {
          setCurrentPage(currentPage - 1);
        }}
      >
        <SVG name="left" />
      </PaginationButton>
    ));
  }

  if (currentPage < pages.length - 1) {
    displayedPages.push((
      <PaginationButton
        key="next"
        className="pagination__list-item pagination__list-item--prevnext"
        title="To next page"
        disabled={currentPage >= pages.length - 1}
        action={() => {
          setCurrentPage(currentPage + 1);
        }}
      >
        <SVG name="right" />
      </PaginationButton>
    ));
  }

  return (
    <ul className="pagination">
      {displayedPages.filter(Boolean)}
    </ul>
  );
};


Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default Pagination;
