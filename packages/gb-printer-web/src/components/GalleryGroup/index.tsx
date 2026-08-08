import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import { blend } from '@mui/system';
import { type Theme } from '@mui/system';
import { type TreeImageGroup } from 'gb-printer-schemas';
import { useTranslations } from 'next-intl';
import React from 'react';
import Debug from '@/components/Debug';
import GalleryGridItem from '@/components/GalleryGridItem';
import GalleryGroupContextMenu from '@/components/GalleryGroupContextMenu';
import ImageRender from '@/components/ImageRender';
import TagsList from '@/components/TagsList';
import WrappedNextLink from '@/components/WrappedNextLink';
import { GalleryViews } from '@/consts/GalleryViews';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useSettingsStore } from '@/stores/stores';

interface Props {
  id: string;
}

const thumbViews: GalleryViews[] = [
  GalleryViews.GALLERY_VIEW_SMALL,
  GalleryViews.GALLERY_VIEW_1X,
];

function GalleryGroup({ id }: Props) {
  const t = useTranslations('GalleryGroup');
  const { getUrl } = useGalleryTreeContext();
  const { enableDebug, galleryView } = useSettingsStore();
  const asThumb = thumbViews.includes(galleryView);
  const { view } = useGalleryTreeContext();

  const group: TreeImageGroup | null = view?.groups.find((g) => g.id === id) || null;
  const path: string | null = group?.fullSlug || null;

  if (!group) {
    return null;
  }

  const debugText = [
    group.title,
    group.fullSlug,
    `Id: ${id}`,
    `Cover: ${group.coverImage}`,
    `Images: ${group.images.length}`,
  ].join('\n');

  return (
    <GalleryGridItem
      selectionText=""
      title={group.title}
      subheader={t('itemCount', { count: group.totalImages })}
      wrapperProps={{
        component: WrappedNextLink,
        href: getUrl({ group: path || '', pageIndex: 0 }),
        sx: {
          textDecoration: 'none',
        },
      }}
      contextMenuComponent={GalleryGroupContextMenu}
      contextMenuProps={{
        groupId: group.id,
      }}
      media={(
        <Box
          sx={{
            position: 'relative',
            margin: '0 auto',

            '& > .MuiBox-root': {
              position: 'absolute',
              top: 0,

              img: {
                transform: 'scale(0.5)',
              },
            },
          }}
        >
          <SvgIcon
            viewBox="0 0 24 21"
            color="secondary"
            sx={(theme: Theme) => ({
              width: '100%',
              height: '100%',
              fill: blend(theme.palette.secondary.main, theme.palette.fgtext.main, 0.25),
            })}
          >
            <path d="M 10,2 H 4 C 2.9,2 2.01,2.9 2.01,4 L 2,16 c 0,1.1 0.9,2 2,2 h 16 c 1.1,0 2,-0.9 2,-2 V 6 C 22,4.9 21.1,4 20,4 h -8 z" />
          </SvgIcon>
          {group.coverImage && (
            <ImageRender hash={group.coverImage} asThumb={asThumb} />
          )}
        </Box>
      )}
      content={(group.tags.length > 0 || (debugText && enableDebug)) && (
        <>
          <TagsList tags={group.tags} fromGroup />
          <Debug text={debugText} />
        </>
      )}
    />
  );
}

export default GalleryGroup;
