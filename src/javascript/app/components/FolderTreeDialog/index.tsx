import React from 'react';
import Link from '@mui/material/Link';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { useTheme } from '@mui/material/styles';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Link as RouterLink } from 'react-router';
import Lightbox from '../Lightbox';
import { ROOT_ID, useGalleryTreeContext } from '../../contexts/galleryTree';
import { useNavigationTools } from '../../contexts/navigationTools';
import type { TreeImageGroup } from '../../../../types/ImageGroup';

interface FolderTreeItemProps {
  group: TreeImageGroup,
  onClick: () => void,
}

function FolderTreeItem({ group, onClick }: FolderTreeItemProps) {
  const { getGroupPath } = useNavigationTools();

  return (
    <TreeItem
      itemId={group.id}
      label={(
        <Link
          component={RouterLink}
          to={getGroupPath(group.id)}
          onClick={onClick}
        >
          {group.title}
        </Link>
      )}
    >
      {
        group.groups.map((childGroup) => (
          <FolderTreeItem
            key={childGroup.id}
            group={childGroup}
            onClick={onClick}
          />
        ))
      }
    </TreeItem>
  );
}

interface FolderTreeDialogProps {
  open: boolean,
  onClose: () => void,
}

function FolderTreeDialog({ open, onClose }: FolderTreeDialogProps) {
  const { pathsOptions, root } = useGalleryTreeContext();
  const theme = useTheme();

  if (pathsOptions.length < 2) {
    return null;
  }

  return (
    <Lightbox
      contentHeight="60vh"
      contentWidth="auto"
      deny={onClose}
      open={open}
      header="Gallery Navigation"
    >
      <SimpleTreeView
        expansionTrigger="iconContainer"
        defaultExpandedItems={[ROOT_ID]}
        sx={{
          width: theme.breakpoints.values.sm,
          height: '60vh',
        }}
      >
        <FolderTreeItem group={root} onClick={onClose} />
      </SimpleTreeView>
    </Lightbox>
  );
}

export default FolderTreeDialog;
