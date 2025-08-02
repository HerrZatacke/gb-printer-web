import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SKIP_LINE } from 'gb-image-decoder';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import GameBoyImage from '@/components/GameBoyImage';
import { ActiveFilterUpdateMode } from '@/hooks/useFilterForm';
import { loadFrameData } from '@/tools/applyFrame/frameData';
import { Frame } from '@/types/Frame';

const transparentLine: string[] = (new Array(20)).fill(SKIP_LINE);

interface Props {
  frame: Frame;
  palette: string[];
  usage: number,
  frameActive: boolean;
  toggleFrame: (mode: ActiveFilterUpdateMode) => void;
}

function FilterFormFrame({ frameActive, toggleFrame, frame, usage, palette }: Props) {
  const [tiles, setTiles] = useState<string[]>([]);

  useEffect(() => {
    const handle = setTimeout(async () => {
      const frameData = await loadFrameData(frame.hash);
      if (!frameData) {
        setTiles([]);
        return;
      }

      const midLine = (line: number): string[] => ([
        ...frameData.left[line],
        ...transparentLine.slice(0, 16),
        ...frameData.right[line],
      ]);

      setTiles([
        ...frameData.upper,
        ...midLine(0),
        ...midLine(1),
        ...transparentLine,
        ...midLine(frameData.left.length - 2),
        ...midLine(frameData.left.length - 1),
        ...frameData.lower,
      ]);
    }, 1);

    return () => { clearTimeout(handle); };
  }, [frame.hash]);

  const t = useTranslations('FilterFormFrame');

  return (
    <Button
      title={t(frameActive ? 'removeFrame' : 'selectFrame', { name: frame.name })}
      onClick={() => toggleFrame(frameActive ? ActiveFilterUpdateMode.REMOVE : ActiveFilterUpdateMode.ADD)}
      variant={frameActive ? 'contained' : 'outlined'}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      color="tertiary"
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        gap={1}
        sx={{ height: '100%' }}
      >
        <Box
          sx={{
            width: '160px',
            minHeight: '72px',
          }}
        >
          <GameBoyImage
            tiles={tiles}
            palette={palette}
            imageStartLine={0}
          />
        </Box>
        <Stack direction="column">
          <Typography variant="body1">
            {frame.name}
          </Typography>
          <Typography variant="caption">
            {t('usage', { usage })}
          </Typography>
        </Stack>
      </Stack>
    </Button>
  );
}

export default FilterFormFrame;
