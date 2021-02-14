import React from 'react';
import PropTypes from 'prop-types';
import PaginationButton from '../PaginationButton';
import SVG from '../SVG';

const Pagination = (props) => {

  if (props.totalPages < 2) {
    return null;
  }

  const pages = [...new Array(props.totalPages)].map((undef, index) => index);
  const { page } = props;

  const displayedPages = pages.map((pageIndex) => {
    switch (pageIndex) {
      // first, current, before/after current and lastpage
      case 0:
      case page - 1:
      case page:
      case page + 1:
      case pages.length - 1:
        return (
          <PaginationButton
            key={pageIndex}
            page={pageIndex}
            active={pageIndex === page}
            title={`To page ${pageIndex + 1}`}
            disabled={pageIndex === page}
          >
            {pageIndex + 1}
          </PaginationButton>
        );
      // ellipsis to indicate left out pages
      case page - 2:
      case page + 2:
        return <li key={pageIndex} className="gallery-button pagination__ellipsis" />;
      default:
        return null;
    }
  });

  if (page > 0) {
    displayedPages.unshift((
      <PaginationButton
        key="back"
        title="To previous page"
        disabled={page < 1}
        page={page - 1}
      >
        <SVG name="left" />
      </PaginationButton>
    ));
  }

  if (page < pages.length - 1) {
    displayedPages.push((
      <PaginationButton
        key="next"
        title="To next page"
        disabled={page >= pages.length - 1}
        page={page + 1}
      >
        <SVG name="right" />
      </PaginationButton>
    ));
  }

  return (
    <ul className="pagination gallery-button__group">
      {displayedPages.filter(Boolean)}
    </ul>
  );
};


Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default Pagination;
