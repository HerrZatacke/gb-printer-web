import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import GalleryImage from '../GalleryImage';
import GalleryHeader from '../GalleryHeader';

const Gallery = (props) => {
  const content = props.images.map((image) => (
    <GalleryImage
      type={props.currentView === 'list' ? 'list' : 'default'}
      key={image.hash}
      hash={image.hash}
      page={props.page}
    />
  ));

  if (props.currentView !== 'list') {
    content.push(
      <li className="gallery-image gallery-image--dummy" key="dummy1" />,
      <li className="gallery-image gallery-image--dummy" key="dummy2" />,
      <li className="gallery-image gallery-image--dummy" key="dummy3" />,
      <li className="gallery-image gallery-image--dummy" key="dummy4" />,
      <li className="gallery-image gallery-image--dummy" key="dummy5" />,
    );
  }


  return (
    <>
      <GalleryHeader page={props.page} isSticky />
      {
        (props.currentView === 'list') ? (
          <table className="gallery gallery--list">
            <tbody>
              {content}
            </tbody>
          </table>
        ) : (
          <ul
            className={
              classnames('gallery', {
                [`gallery--${props.currentView}`]: true,
              })
            }
          >
            {content}
          </ul>
        )
      }
      {
        props.images.length < 3 ? null : (
          <GalleryHeader page={props.page} isBottom />
        )
      }
    </>
  );
};

Gallery.propTypes = {
  images: PropTypes.array.isRequired,
  currentView: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
};

Gallery.defaultProps = {
};

export default Gallery;
