import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import GalleryImage from '../GalleryImage';
import GalleryListImage from '../GalleryListImage';

const Gallery = (props) => {

  const ImageComponent = props.currentView === 'list' ? GalleryListImage : GalleryImage;

  const content = props.images.map((image) => (
    <ImageComponent
      key={image.hash}
      hash={image.hash}
      palette={image.palette}
      title={image.title}
      created={image.created}
      index={image.index}
      hashes={image.hashes}
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


  return (props.currentView === 'list') ? (
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
  );
};

Gallery.propTypes = {
  images: PropTypes.array.isRequired,
  currentView: PropTypes.string.isRequired,
};

Gallery.defaultProps = {
};

export default Gallery;
