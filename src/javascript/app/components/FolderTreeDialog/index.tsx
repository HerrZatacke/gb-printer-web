import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Link as RouterLink } from 'react-router';
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

const overlayContainer = document.body;

interface FolderTreeDialogProps {
  open: boolean,
  onClose: () => void,
}

function FolderTreeDialog({ open, onClose }: FolderTreeDialogProps) {
  const { pathsOptions, root } = useGalleryTreeContext();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (pathsOptions.length < 2) {
    return null;
  }

  return (
    <Dialog
      container={overlayContainer}
      fullScreen={fullScreen}
      maxWidth="lg"
      open={open}
      onClose={onClose}
      aria-labelledby="gallery-navigation-header"
      keepMounted
    >
      <DialogTitle id="gallery-navigation-header">
        Gallery Navigation
        <IconButton
          title="Open Gallery Navigation"
          color="inherit"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
    </Dialog>

  );
}

export default FolderTreeDialog;
