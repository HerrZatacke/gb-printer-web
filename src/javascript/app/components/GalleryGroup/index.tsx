import React from 'react';
import { Link } from 'react-router';
import Box from '@mui/material/Box';
import ImageRender from '../ImageRender';
import TagsList from '../TagsList';
import GalleryGroupContextMenu from '../GalleryGroupContextMenu';
import { useGalleryGroup } from './useGalleryGroup';
import { useGalleryImage } from '../GalleryImage/useGalleryImage';
import GalleryGridItem from '../GalleryGridItem';

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
    framePalette,
    frame,
    lockFrame,
    rotation,
  } = galleryImageData;

  return (
    <GalleryGridItem
      selectionText=""
      title={group.title}
      subheader={`${group.images.length} items`}
      wrapperComponent={Box}
      wrapperProps={{
        component: Link,
        to: `/gallery/${path}page/1`,
        sx: {
          textDecoration: 'none',
        },
      }}
      contextMenuComponent={GalleryGroupContextMenu}
      contextMenuProps={{
        groupId: group.id,
      }}
      media={(
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
      )}
      content={group.tags.length > 0 && (
        <TagsList tags={group.tags} fromGroup />
      )}
    />
  );
}

export default GalleryGroup;
