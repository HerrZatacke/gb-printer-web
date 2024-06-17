import React from 'react';
import './index.scss';

interface Props {
  imageCount: number,
  selectedCount: number,
  filteredCount: number,
}

function GalleryIntroText(props: Props) {
  return (
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
}

export default GalleryIntroText;
