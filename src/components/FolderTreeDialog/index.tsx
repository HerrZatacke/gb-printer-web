import { alpha } from '@mui/material';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/system';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';
import Lightbox from '@/components/Lightbox';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import { useNavigationToolsContext } from '@/contexts/navigationTools/NavigationToolsProvider';
import { usePathSegments } from '@/hooks/usePathSegments';
import unique from '@/tools/unique';
import type { TreeImageGroup } from '@/types/ImageGroup';

interface FolderTreeItemProps {
  group: TreeImageGroup,
  onClick: () => void,
}

function FolderTreeItem({ group, onClick }: FolderTreeItemProps) {
  const { getGroupPath } = useNavigationToolsContext();

  return (
    <TreeItem
      itemId={group.id}
      label={(
        <Link
          component={NextLink}
          href={getGroupPath(group.id, 0)}
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
  const t = useTranslations('FolderTreeDialog');
  const { pathsOptions, root } = useGalleryTreeContext();
  const { currentGroup } = useNavigationToolsContext();
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
      header={t('dialogHeader')}
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
