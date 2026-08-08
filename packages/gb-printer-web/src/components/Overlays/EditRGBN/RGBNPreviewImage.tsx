import Box from '@mui/material/Box';
import { RGBNTiles } from 'gb-image-decoder';
import { type RGBNHashes } from 'gb-printer-schemas';
import React, { useCallback, useEffect, useState } from 'react';
import GameBoyImage from '@/components/GameBoyImage';
import { defaultRGBNPalette } from '@/consts/defaults';
import { loadImageTiles as getLoadImageTiles } from '@/tools/loadImageTiles';

interface Props {
  rgbnHashes: RGBNHashes;
}

function RGBNPreviewImage({ rgbnHashes }: Props) {
  const [tiles, setTiles] = useState<RGBNTiles | null>(null);

  const loadImageTiles = useCallback(
    async (hashesOverride?: RGBNHashes): Promise<RGBNTiles> => {
      const imageLoader = getLoadImageTiles();

      return (await imageLoader('', undefined, undefined, hashesOverride) as RGBNTiles);
    },
    [],
  );

  useEffect(()=> {
    const handle = window.setTimeout(async () => {
      setTiles(await loadImageTiles(rgbnHashes));
    }, 1);

    return () => window.clearTimeout(handle);
  });

  if (!tiles) { return null; }

  return (
    <Box component="li" >
      <GameBoyImage
        palette={defaultRGBNPalette}
        tiles={tiles}
        imageStartLine={2}
      />
    </Box>
  );
}

export default RGBNPreviewImage;
