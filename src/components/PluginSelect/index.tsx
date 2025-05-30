import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import WarningIcon from '@mui/icons-material/Warning';
import useFiltersStore from '../../stores/filtersStore';
import useItemsStore from '../../stores/itemsStore';
import { usePluginsContext } from '../../contexts/plugins';

interface Props {
  pluginAnchor: HTMLElement | null,
  onClose: () => void,
  hash?: string,
}

function PluginSelect({ pluginAnchor, hash, onClose }: Props) {
  const { plugins } = useItemsStore();
  const { imageSelection } = useFiltersStore();
  const { runWithImage, runWithImages } = usePluginsContext();

  const dispatchToPlugin = (url: string) => {
    if (hash) {
      runWithImage(url, hash);
    } else {
      runWithImages(url, imageSelection);
    }
  };

  return (
    <Menu
      open={!!pluginAnchor}
      anchorEl={pluginAnchor}
      onClose={onClose}
    >
      {
        plugins.map(({ url, name, description, loading, error }) => (
          <MenuItem
            key={url}
            disabled={Boolean(loading || error)}
            title={`${error || description || ''}\n${url}`}
            onClick={() => {
              onClose();
              dispatchToPlugin(url);
            }}
          >
            {error && <WarningIcon color="warning" />}
            {loading && <CircularProgress color="secondary" size={22} />}
            {name || url}
          </MenuItem>
        ))
      }
    </Menu>
  );
}

export default PluginSelect;
