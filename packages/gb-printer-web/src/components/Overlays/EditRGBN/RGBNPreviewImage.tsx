import Box from '@mui/material/Box';
import { RGBNTiles } from 'gb-image-decoder';
import { type RGBNHashes } from 'gb-printer-schemas';
import React, { useEffect, useState } from 'react';
import GameBoyImage from '@/components/GameBoyImage';
import { defaultRGBNPalette } from '@/consts/defaults';
import { loadImageTiles } from '@/tools/loadImageTiles';

interface Props {
  rgbnHashes: RGBNHashes;
}

function RGBNPreviewImage({ rgbnHashes }: Props) {
  const [tiles, setTiles] = useState<RGBNTiles | null>(null);

  useEffect(()=> {
    let cancelled = false;

    const handle = window.setTimeout(async () => {
      if (Object.values(rgbnHashes).filter(Boolean).length) {
        const rgbnTiles = await loadImageTiles('', undefined, undefined, rgbnHashes) as RGBNTiles;
        if (!cancelled) {
          setTiles(rgbnTiles);
        }
      } else {
        setTiles(null);
        return;
      }
    }, 1);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [rgbnHashes]);

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
