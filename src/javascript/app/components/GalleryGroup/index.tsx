import { Link } from 'react-router-dom';
import React from 'react';
import { useGalleryGroup } from './useGalleryGroup';
import ImageRender from '../ImageRender';
import { useGalleryImage } from '../GalleryImage/useGalleryImage';

import './index.scss';

interface Props {
  hash: string,
}

function GalleryGroup({ hash }: Props) {
  const { group, path } = useGalleryGroup(hash);

  const { galleryImageData } = useGalleryImage(hash);

  if (!galleryImageData || !group) {
    return null;
  }

  const {
    hashes,
    palette,
    invertPalette,
    frame,
    lockFrame,
    rotation,
  } = galleryImageData;

  return (
    <li
      className="gallery-group gallery-item"
      role="presentation"
    >
      <Link
        className="gallery-group__link"
        to={`/gallery/${path}page/1`}
      >
        <ImageRender
          lockFrame={lockFrame}
          invertPalette={invertPalette}
          palette={palette}
          frameId={frame}
          hash={hash}
          hashes={hashes}
          rotation={rotation}
        />
        <p className="gallery-group__info">{ `${group.images.length} images` }</p>
        <p className="gallery-group__title">{ group.title }</p>
        <div className="gallery-group__temp">FOLDER</div>
      </Link>
    </li>
  );
}

export default GalleryGroup;