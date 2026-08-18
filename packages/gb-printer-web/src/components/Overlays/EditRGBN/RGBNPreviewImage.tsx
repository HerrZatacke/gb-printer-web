import Box from '@mui/material/Box';
import { RGBNTiles } from 'gb-image-decoder';
import { type RGBNHashes } from 'gb-printer-schemas';
import React, { useCallback, useEffect, useState } from 'react';
import GameBoyImage from '@/components/GameBoyImage';
import { defaultRGBNPalette } from '@/consts/defaults';
import { loadImageTiles } from '@/tools/loadImageTiles';

interface Props {
  rgbnHashes: RGBNHashes;
}

function RGBNPreviewImage({ rgbnHashes }: Props) {
  const [tiles, setTiles] = useState<RGBNTiles | null>(null);

  useEffect(()=> {
    const handle = window.setTimeout(async () => {
      const rgbnTiles = await loadImageTiles('', undefined, undefined, rgbnHashes) as RGBNTiles;
      setTiles(rgbnTiles);
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
