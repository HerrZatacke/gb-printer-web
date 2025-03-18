import React, { useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import SegmentIcon from '@mui/icons-material/Segment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Link as RouterLink } from 'react-router';
import FolderTreeDialog from '../FolderTreeDialog';
import useEditStore from '../../stores/editStore';
import { useGalleryTreeContext } from '../../contexts/galleryTree';
import { useNavigationTools } from '../../contexts/navigationTools';
import { usePathSegments } from '../../../hooks/usePathSegments';
import { shorten } from '../../../tools/shorten';
import type { TreeImageGroup } from '../../../../types/ImageGroup';

interface FolderTreeItemProps {
  group: TreeImageGroup,
}

function FolderTreeItem({ group }: FolderTreeItemProps) {
  const { getGroupPath } = useNavigationTools();

  return (
    <TreeItem
      itemId={group.id}
      label={(
        <Stack direction="row" gap={2}>
          <Typography>{group.title}</Typography>
          <Link
            component={RouterLink}
            to={getGroupPath(group.id)}
            onClick={(ev) => ev.stopPropagation()}
          >
            🔗
          </Link>
        </Stack>
      )}
    >
      {
        group.groups.map((childGroup) => (
          <FolderTreeItem
            key={childGroup.id}
            group={childGroup}
          />
        ))
      }
    </TreeItem>
  );
}

function FolderBreadcrumb() {
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
        { segments.map(({ group, path }, index) => (
          <Stack
            key={group.id}
            direction="row"
            gap={0.5}
            alignItems="center"
          >
            { index > 0 ? (
              <Link
                component={RouterLink}
                title={group.title}
                to={`/gallery/${path}`}
              >
                { index ? shorten(group.title, 30) : <HomeIcon fontSize="small" /> }
              </Link>
            ) : (
              <IconButton
                component={RouterLink}
                title={group.title}
                to={`/gallery/${path}`}
                sx={{ fontSize: 16 }}
              >
                <HomeIcon fontSize="inherit" />
              </IconButton>
            ) }
            { index > 0 && (
              <IconButton
                onClick={() => setEditImageGroup({ groupId: group.id })}
                title={`Edit group "${group.title}"`}
                sx={{ fontSize: 16 }}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            ) }
          </Stack>
        )) }
      </Breadcrumbs>
      <IconButton
        title="Open Gallery Navigation"
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
