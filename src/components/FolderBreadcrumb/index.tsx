import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import SegmentIcon from '@mui/icons-material/Segment';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import FolderTreeDialog from '@/components/FolderTreeDialog';
import WrappedNextLink from '@/components/WrappedNextLink';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { usePathSegments } from '@/hooks/usePathSegments';
import { useEditStore } from '@/stores/stores';
import { shorten } from '@/tools/shorten';

function FolderBreadcrumb() {
  const t = useTranslations('FolderBreadcrumb');
  const { pathsOptions } = useGalleryTreeContext();
  const { setEditImageGroup } = useEditStore();
  const { segments } = usePathSegments();
  const [treeDialogOpen, setTreeDialogOpen] = useState<boolean>(false);

  if (pathsOptions.length < 2) {
    return null;
  }

  return (
    <Stack
      direction="row"
      gap={2}
      justifyContent="space-between"
      alignItems="center"
    >
      <Breadcrumbs>
        { segments.map(({ group, link }, index) => (
          <Stack
            key={group.id}
            direction="row"
            gap={0.5}
            alignItems="center"
          >
            { index > 0 ? (
              <Link
                component={WrappedNextLink}
                title={group.title}
                href={link}
                prefetch={false}
              >
                { index ? shorten(group.title, 30) : <HomeIcon fontSize="small" /> }
              </Link>
            ) : (
              <IconButton
                component={WrappedNextLink}
                title={group.title}
                href={link}
                prefetch={false}
                sx={{ fontSize: 16 }}
              >
                <HomeIcon fontSize="inherit" />
              </IconButton>
            ) }
            { index > 0 && (
              <IconButton
                onClick={() => setEditImageGroup({ groupId: group.id })}
                title={t('editGroup', { title: group.title })}
                sx={{ fontSize: 16 }}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            ) }
          </Stack>
        )) }
      </Breadcrumbs>
      <IconButton
        title={t('openNavigation')}
        onClick={() => setTreeDialogOpen(true)}
      >
        <SegmentIcon />
      </IconButton>
      <FolderTreeDialog
        open={treeDialogOpen}
        onClose={() => setTreeDialogOpen(false)}
      />
    </Stack>
  );
}

export default FolderBreadcrumb;
