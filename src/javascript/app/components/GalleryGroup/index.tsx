import { Link } from 'react-router';
import React from 'react';
import ImageRender from '../ImageRender';
import TagsList from '../GalleryImage/TagsList';
import { useGalleryGroup } from './useGalleryGroup';
import { useGalleryImage } from '../GalleryImage/useGalleryImage';
import { useImageGroups } from '../../../hooks/useImageGroups';

import './index.scss';

interface Props {
  hash: string,
}

function GalleryGroup({ hash }: Props) {
  const { group, path } = useGalleryGroup(hash);

  const { galleryImageData } = useGalleryImage(hash);

  const { deleteGroup, editGroup } = useImageGroups();

  if (!galleryImageData || !group) {
    return null;
  }

  const {
    hashes,
    palette,
    invertPalette,
    framePalette,
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
        <div className="gallery-group__image">
          <div className="gallery-group__group-marker" />
          <ImageRender
            lockFrame={lockFrame}
            invertPalette={invertPalette}
            framePalette={framePalette}
            palette={palette}
            frameId={frame}
            hash={hash}
            hashes={hashes}
            rotation={rotation}
          />
        </div>
        <p className="gallery-group__info">{ `${group.images.length} images` }</p>
        <p className="gallery-group__title">{ group.title }</p>
        <TagsList tags={group.tags} fromGroup />
      </Link>
      <div className="gallery-group__buttons">
        <button
          className="gallery-group__button button"
          type="button"
          onClick={() => editGroup(group.id)}
        >
          Edit Group
        </button>
        <button
          className="gallery-group__button button"
          type="button"
          onClick={() => deleteGroup(group.id)}
        >
          Delete Group
        </button>
      </div>
    </li>
  );
}

export default GalleryGroup;
