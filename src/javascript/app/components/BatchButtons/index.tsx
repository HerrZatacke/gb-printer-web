import React, { type ReactNode, useState } from 'react';
import Badge from '@mui/material/Badge';
import ButtonGroup from '@mui/material/ButtonGroup';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import ExtensionIcon from '@mui/icons-material/Extension';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import GifIcon from '@mui/icons-material/Gif';
import IconButton from '@mui/material/Button';
import PaletteIcon from '@mui/icons-material/Palette';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import PluginSelect from '../PluginSelect';
import useBatchButtons from './useBatchButtons';
import { BatchActionType } from '../../../consts/batchActionTypes';

const BATCH_ACTIONS: BatchActionType[] = [
  BatchActionType.DOWNLOAD,
  BatchActionType.DELETE,
  BatchActionType.EDIT,
  BatchActionType.ANIMATE,
];

const BATCH_ACTIONS_MONOCHROME: BatchActionType[] = [
  BatchActionType.RGB,
];

const batchActionTitle = (id: BatchActionType) => {
  switch (id) {
    case BatchActionType.DELETE:
      return 'Delete';
    case BatchActionType.ANIMATE:
      return 'Animate';
    case BatchActionType.DOWNLOAD:
      return 'Download';
    case BatchActionType.EDIT:
      return 'Edit';
    case BatchActionType.RGB:
      return 'Create RGB Images';
    default:
      return '';
  }
};


const actionIcon = (action: BatchActionType): ReactNode => {
  switch (action) {
    case BatchActionType.DELETE:
      return <DeleteIcon />;
    case BatchActionType.ANIMATE:
      return <GifIcon />;
    case BatchActionType.DOWNLOAD:
      return <DownloadIcon />;
    case BatchActionType.EDIT:
      return <EditIcon />;
    case BatchActionType.RGB:
      return <PaletteIcon />;
    default:
      return null;
  }
};

interface Props {
  page: number,
}

function BatchButtons({ page }: Props) {

  const {
    hasPlugins,
    batchEnabled,
    monochromeBatchEnabled,
    activeFilters,
    selectedImageCount,
    hasSelected,
    batchTask,
    checkAll,
    unCheckAll,
    filter,
    showSortOptions,
  } = useBatchButtons(page);

  const [pluginAnchor, setPluginAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <ButtonGroup
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        color="tertiary"
        variant="contained"
        sx={{ '& .MuiButton-root': { width: 40, height: 40 } }}
        disableElevation
      >
        <IconButton
          onClick={showSortOptions}
          title="Manage Sorting"
        >
          <SwapVertIcon />
        </IconButton>
        <IconButton
          onClick={filter}
          title="Manage Filters"
        >
          <Badge
            badgeContent={activeFilters}
            color="info"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <FilterAltIcon />
          </Badge>
        </IconButton>
        <IconButton
          onClick={hasSelected ? unCheckAll : checkAll}
          title={hasSelected ? 'Uncheck All' : 'Check All'}
        >
          <Badge
            badgeContent={selectedImageCount}
            color="info"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <CheckBoxIcon />
          </Badge>
        </IconButton>
        {
          BATCH_ACTIONS.map((action) => (
            <IconButton
              key={action}
              disabled={!batchEnabled}
              onClick={() => batchTask(action)}
              title={batchActionTitle(action)}
            >
              { actionIcon(action) }
            </IconButton>
          ))
        }
        {
          BATCH_ACTIONS_MONOCHROME.map((action) => (
            <IconButton
              key={action}
              disabled={!monochromeBatchEnabled}
              onClick={() => batchTask(action)}
              title={batchActionTitle(action)}
            >
              { actionIcon(action) }
            </IconButton>
          ))
        }
        {hasPlugins ? (
          <IconButton
            onClick={(ev) => {
              setPluginAnchor(ev.target as HTMLElement);
            }}
            title="Use Plugin"
          >
            <ExtensionIcon />
          </IconButton>
        ) : null}
      </ButtonGroup>
      <PluginSelect
        pluginAnchor={pluginAnchor}
        onClose={() => setPluginAnchor(null)}
      />
    </>
  );
}

export default BatchButtons;
