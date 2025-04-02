/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */
import React, { useMemo, useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import type { RGBNPalette } from 'gb-image-decoder';
import FrameSelect from '../FrameSelect';
import GreySelect from '../GreySelect';
import PaletteSelect from '../PaletteSelect';
import TagsSelect from '../TagsSelect';
import ImageMeta from '../ImageMeta';
import type { TagChange } from '../../../tools/applyTagChanges';
import type { ImageMetadata, RGBNHashes } from '../../../../types/Image';
import type { Rotation } from '../../../tools/applyRotation';
import type { TagUpdateMode } from '../../../tools/modifyTagChanges';

enum TabType {
  PALETTE = 'pal',
  FRAME = 'frame',
  TAGS = 'tags',
  MISC = 'misc',
}

interface Props {
  hash: string,
  invertPalette?: boolean,
  invertFramePalette?: boolean,
  tags: TagChange,
  regularImage: boolean,
  lockFrame?: boolean,

  updateCreated: (value: string) => void,
  updatePalette: (paletteUpdate: (string | RGBNPalette), confirm?: boolean) => void,
  updateInvertPalette: (value: boolean) => void,
  updateFramePalette: (paletteUpdate: string, confirm?: boolean) => void,
  updateInvertFramePalette: (value: boolean) => void,
  updateTags: (mode: TagUpdateMode, tag: string) => void,
  updateFrame: (value: string) => void,
  updateFrameLock: (value: boolean) => void,
  updateRotation: (value: Rotation) => void,
  resetTags: () => void,

  hashes?: RGBNHashes,
  created?: string,
  paletteShort?: string,
  framePaletteShort?: string,
  paletteRGBN?: RGBNPalette,
  frame?: string,
  meta?: ImageMetadata,
  rotation?: number,
  mixedTypes?: boolean,
}

const tabTitle = (tabType: TabType, isRGBN: boolean): string => {
  switch (tabType) {
    case TabType.FRAME:
      return 'Frame';
    case TabType.MISC:
      return 'Misc';
    case TabType.PALETTE:
      return isRGBN ? 'Colors' : 'Palette';
    case TabType.TAGS:
      return 'Tags';
    default:
      return '';
  }
};

function EditImageTabs(props: Props) {

  const tabs: TabType[] = useMemo(() => {
    const memoTabs: TabType[] = [];

    if (!props.mixedTypes) {
      memoTabs.push(TabType.PALETTE);
    }

    if (props.regularImage) {
      memoTabs.push(TabType.FRAME);
    }

    memoTabs.push(TabType.TAGS, TabType.MISC);

    return memoTabs;
  }, [props.mixedTypes, props.regularImage]);

  const [tab, setTab] = useState<TabType | null>(null);

  useEffect(() => {
    setTab(tabs[0]);
  }, [tabs]);

  return (
    <Stack
      direction="column"
      spacing={1}
    >
      <TabContext value={tab || tabs[0]}>
        <TabList
          variant="fullWidth"
          indicatorColor="secondary"
          allowScrollButtonsMobile={false}
        >
          {
            tabs.map((tabType) => (
              <Tab
                label={tabTitle(tabType, !!props.paletteRGBN)}
                key={tabType}
                value={tabType}
                onClick={() => setTab(tabType)}
              />
            ))
          }
        </TabList>
        <TabPanel value={TabType.PALETTE}>
          {props.paletteRGBN ? (
            <GreySelect
              values={props.paletteRGBN}
              onChange={props.updatePalette}
              useChannels={{
                r: !!props.hashes?.r,
                g: !!props.hashes?.g,
                b: !!props.hashes?.b,
                n: !!props.hashes?.n,
              }}
            />
          ) : (
            <PaletteSelect
              value={props.paletteShort || ''}
              invertPalette={props.invertPalette}
              onChange={props.updatePalette}
              updateInvertPalette={props.updateInvertPalette}
            />
          )}
        </TabPanel>
        <TabPanel value={TabType.FRAME}>
          <FrameSelect
            updateFrame={props.updateFrame}
            updateFrameLock={props.updateFrameLock}
            frame={props.frame || ''}
            lockFrame={props.lockFrame}
          />
          {
            props.lockFrame && !props.paletteRGBN ? (
              <PaletteSelect
                value={props.framePaletteShort || ''}
                invertPalette={props.invertFramePalette}
                onChange={props.updateFramePalette}
                updateInvertPalette={props.updateInvertFramePalette}
              />
            ) : null
          }
        </TabPanel>
        <TabPanel value={TabType.TAGS}>
          <TagsSelect
            updateTags={props.updateTags}
            resetTags={props.resetTags}
            tags={props.tags}
          />
        </TabPanel>
        <TabPanel value={TabType.MISC}>
          <ImageMeta
            created={props.created}
            hash={props.hash}
            hashes={props.hashes}
            updateCreated={props.updateCreated}
            meta={props.meta}
            rotation={props.rotation}
            updateRotation={props.updateRotation}
          />
        </TabPanel>
      </TabContext>
    </Stack>
  );
}

export default EditImageTabs;
