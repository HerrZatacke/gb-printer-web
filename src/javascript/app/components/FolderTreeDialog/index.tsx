import React, { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';
import type { Theme } from '@mui/system';
import { Link as RouterLink } from 'react-router';
import Lightbox from '../Lightbox';
import { useGalleryTreeContext } from '../../contexts/galleryTree';
import { useNavigationTools } from '../../contexts/navigationTools';
import { usePathSegments } from '../../../hooks/usePathSegments';
import type { TreeImageGroup } from '../../../../types/ImageGroup';
import unique from '../../../tools/unique';

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
          sx={{ display: 'block' }}
        >
          {group.title}
        </Link>
      )}
      sx={(theme: Theme) => ({
        '& > .MuiTreeItem-content.Mui-selected': {
          backgroundColor: alpha(theme.palette.secondary.main, 0.8),
          color: theme.palette.secondary.contrastText,
          '&:hover,&.Mui-focused': {
            backgroundColor: theme.palette.secondary.main,
          },
        },
      })}
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
  const { currentGroup } = useNavigationTools();
  const theme = useTheme();
  const { segments } = usePathSegments();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    setExpandedItems((currentItems: string[]) => {
      const fromNavi = segments.map(({ group }) => (group.id));
      return unique([...fromNavi, ...currentItems]);
    });
  }, [segments]);

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
      keepMounted={false}
    >
      <SimpleTreeView
        expansionTrigger="iconContainer"
        expandedItems={expandedItems}
        onExpandedItemsChange={(_, items) => setExpandedItems(items)}
        selectedItems={currentGroup.id}
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
