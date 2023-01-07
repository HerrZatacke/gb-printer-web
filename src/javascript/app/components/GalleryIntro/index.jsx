import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const GalleryIntroText = (props) => (
  <>
    <h2 className="gallery-intro__counter">
      {`${props.imageCount} images`}
      { props.filteredCount ? ` / ${props.filteredCount} filtered` : null}
      { props.selectedCount ? ` / ${props.selectedCount} selected` : null}
    </h2>
    <p className="gallery-intro__content-hint">
      These images are stored in the localStorage of your browser.
      That&apos;s why you (currently) cannot share a link to one of them.
      <br />
      Also if you clear your browser&apos;s cookies, the images will be gone too.
    </p>
  </>
);

GalleryIntroText.propTypes = {
  imageCount: PropTypes.number.isRequired,
  selectedCount: PropTypes.number.isRequired,
  filteredCount: PropTypes.number.isRequired,
};

export default GalleryIntroText;
