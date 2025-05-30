import type { RGBNPalette, Rotation } from 'gb-image-decoder';
import { useEffect, useMemo, useState } from 'react';
import { missingGreyPalette } from '@/consts/defaults';
import useBatchUpdate from '@/hooks/useBatchUpdate';
import { useScreenDimensions } from '@/hooks/useScreenDimensions';
import useEditStore from '@/stores/editStore';
import useItemsStore from '@/stores/itemsStore';
import type { TagChange } from '@/tools/applyTagChanges';
import { isRGBNImage } from '@/tools/isRGBNImage';
import { getImageTileCount } from '@/tools/loadImageTiles';
import modifyTagChanges from '@/tools/modifyTagChanges';
import type { TagUpdateMode } from '@/tools/modifyTagChanges';
import type { ImageMetadata, MonochromeImage, RGBNImage } from '@/types/Image';
import type { ImageUpdates } from '@/types/ImageActions';
import type { Palette } from '@/types/Palette';

interface Batch {
  created: boolean,
  title: boolean,
  frame: boolean,
  lockFrame: boolean,
  tags: boolean,
  rotation: boolean,
  palette: boolean,
  invertPalette: boolean,
  framePalette: boolean,
  invertFramePalette: boolean,
}

interface ToEdit {
  created: string,
  hash: string,
  height: number,
  imageCount: number,
  invertPalette: boolean,
  invertFramePalette: boolean,
  lockFrame: boolean,
  mixedTypes: boolean,
  tags: string[],
  title: string,

  frame?: string,
  hashes?: object,
  meta?: ImageMetadata,
  paletteRGBN?: RGBNPalette,
  paletteShort?: string,
  framePaletteShort?: string,
  rotation?: Rotation,
}

interface Form {
  title: string,
  created: string,
  frame: string,
  lockFrame?: boolean,
  rotation?: Rotation,
  invertPalette?: boolean,
  invertFramePalette?: boolean,
  paletteShort: string,
  framePaletteShort: string,
  paletteRGBN?: RGBNPalette,
}

interface UseEditForm {
  toEdit?: ToEdit,
  form: Form,
  isRegularImage: boolean,
  shouldUpdate: Record<keyof ImageUpdates | 'tags', boolean>,
  willUpdateBatch: string[],
  tagChanges: TagChange,
  usedPalette: string[] | RGBNPalette,
  usedFramePalette: string[],

  updateForm: (what: keyof Batch) => (value: string | boolean | Rotation) => void,
  updatePalette: (paletteUpdate: (string | RGBNPalette), confirm?: boolean) => void,
  updateTags: (mode: TagUpdateMode, tag: string) => void,
  resetTags: () => void,
  updateFramePalette: (paletteUpdate: string, confirm?: boolean) => void,

  save: () => void;
  cancel: () => void,
}

const willUpdate = (batch: Batch): string[] => ([
  batch.created ? 'Update date' : '',
  batch.title ? 'Update title' : '',
  batch.palette ? 'Update image palette colors' : '',
  batch.invertPalette ? 'Update invert image palette setting' : '',
  batch.frame ? 'Update frame' : '',
  batch.lockFrame ? 'Update separate frame settings' : '',
  batch.framePalette ? 'Update frame palette colors' : '',
  batch.invertFramePalette ? 'Update invert frame palette setting' : '',
  batch.tags ? 'Update tags' : '',
  batch.rotation ? 'Update rotation' : '',
]
  .filter(Boolean)
);


export const useEditForm = (): UseEditForm => {
  const { editImages, cancelEditImages } = useEditStore();
  const { palettes, frames, images } = useItemsStore();
  const { batchUpdateImages } = useBatchUpdate();

  const findPalette = (shortName?: string): Palette => (
    palettes.find((palette) => shortName === palette.shortName) || missingGreyPalette
  );

  const tileCounter = getImageTileCount(images, frames);


  const dimensions = useScreenDimensions();

  const toEdit = useMemo((): ToEdit | undefined => {
    if (!editImages) {
      return undefined;
    }

    const batch = editImages.batch || [];
    const stateTags = editImages.tags || [];

    if (!batch[0]) {
      return undefined;
    }

    const image = images.find(({ hash }) => hash === batch[0]);

    if (!image) {
      return undefined;
    }

    const height = (dimensions.width <= 600) ?
      dimensions.height :
      Math.min(900, dimensions.height);

    const typeCount = batch.reduce((acc, selHash) => {
      const tcImage = images.find(({ hash }) => hash === selHash);
      if (!tcImage) {
        return acc;
      }

      const isRGB = isRGBNImage(tcImage);
      return {
        mono: acc.mono || !isRGB,
        rgb: acc.rgb || isRGB,
      };
    }, { mono: false, rgb: false });

    const mixedTypes = typeCount.mono && typeCount.rgb;
    const paletteRGBN = isRGBNImage(image) ? (image as RGBNImage).palette : undefined;
    const paletteShort = !isRGBNImage(image) ? (image as MonochromeImage).palette : undefined;
    const framePaletteShort = !isRGBNImage(image) ? (image as MonochromeImage).framePalette : undefined;


    return ({
      created: image.created,
      hash: image.hash,
      height,
      imageCount: batch?.length || 0,
      invertPalette: (image as MonochromeImage).invertPalette || false,
      invertFramePalette: (image as MonochromeImage).invertFramePalette || false,
      lockFrame: image.lockFrame || false,
      mixedTypes,
      tags: stateTags,
      title: image.title,

      frame: image.frame,
      hashes: isRGBNImage(image) ? (image as RGBNImage).hashes : undefined,
      meta: image.meta,
      paletteRGBN,
      paletteShort,
      framePaletteShort,
      rotation: image.rotation,
    });
  }, [editImages, images, dimensions]);

  const [title, updateTitle] = useState<string>(toEdit?.title || '');
  const [created, updateCreated] = useState<string>(toEdit?.created || '');
  const [frame, updateFrame] = useState<string>(toEdit?.frame || '');
  const [lockFrame, updateFrameLock] = useState<boolean | undefined>(toEdit?.lockFrame);
  const [rotation, updateRotation] = useState<Rotation | undefined>(toEdit?.rotation);
  const [invertPalette, updateInvertPalette] = useState<boolean | undefined>(toEdit?.invertPalette);
  const [invertFramePalette, updateInvertFramePalette] = useState<boolean | undefined>(toEdit?.invertFramePalette);
  const [paletteShort, updatePaletteShort] = useState<string>(toEdit?.paletteShort || '');
  const [framePaletteShort, updateFramePaletteShort] = useState<string>(toEdit?.framePaletteShort || '');
  const [paletteRGBN, updatePaletteRGBN] = useState<RGBNPalette | undefined>(toEdit?.paletteRGBN);

  const [isRegularImage, setIsRegularImage] = useState<boolean>(false);

  const form: Form = {
    title,
    created,
    frame,
    lockFrame,
    rotation,
    invertPalette,
    paletteShort,
    framePaletteShort,
    invertFramePalette,
    paletteRGBN,
  };

  const usedPalette = paletteRGBN || findPalette(paletteShort).palette;
  const usedFramePalette = findPalette(framePaletteShort).palette;

  const hash = toEdit?.hash;
  useEffect(() => {
    const updateIsRegular = async () => {
      if (!hash) {
        return;
      }

      const tileCount = await tileCounter(hash);
      setIsRegularImage(tileCount === 360);
    };

    updateIsRegular();
  }, [tileCounter, hash]);

  const [tagChanges, updateTagChanges] = useState<TagChange>({
    initial: toEdit?.tags || [],
    add: [],
    remove: [],
  });

  const [shouldUpdate, updateShouldUpdate] = useState<Batch>({
    created: false,
    title: false,
    frame: false,
    lockFrame: false,
    tags: false,
    rotation: false,
    palette: false,
    invertPalette: false,
    framePalette: false,
    invertFramePalette: false,
  });


  const updateForm = (what: keyof Batch) => (value: string | boolean | Rotation) => {
    updateShouldUpdate({ ...shouldUpdate, [what]: true });

    switch (what) {
      case 'title':
        updateTitle(value as string);
        break;
      case 'created':
        updateCreated(value as string);
        break;
      case 'invertPalette':
        updateInvertPalette(value as boolean);
        break;
      case 'invertFramePalette':
        updateInvertFramePalette(value as boolean);
        break;
      case 'framePalette':
        updateFramePaletteShort(value as string);
        break;
      case 'frame':
        updateFrame(value as string);
        break;
      case 'lockFrame':
        updateFrameLock(value as boolean);
        break;
      case 'rotation':
        updateRotation(value as Rotation);
        break;
      default:
    }
  };

  const updatePalette = (paletteUpdate: (string | RGBNPalette), confirm?: boolean) => {
    if (!paletteUpdate) {
      return;
    }

    if (confirm) {
      updateShouldUpdate({ ...shouldUpdate, palette: true });
    }

    if (typeof paletteUpdate === 'string') {
      updatePaletteShort(paletteUpdate);
    } else {
      updatePaletteRGBN(paletteUpdate as RGBNPalette);
    }
  };

  const updateFramePalette = (paletteUpdate: string, confirm?: boolean) => {
    if (confirm) {
      updateShouldUpdate({ ...shouldUpdate, framePalette: true });
    }

    updateFramePaletteShort(paletteUpdate as string);
  };

  const updateTags = (mode: TagUpdateMode, tag: string) => {
    updateShouldUpdate({ ...shouldUpdate, tags: true });
    updateTagChanges({
      ...tagChanges,
      ...modifyTagChanges(tagChanges, { mode, tag }),
    });
  };

  const resetTags = () => {
    updateShouldUpdate({ ...shouldUpdate, tags: false });
    updateTagChanges(({ initial }) => ({
      initial,
      add: [],
      remove: [],
    }));
  };

  return {
    toEdit,
    form,
    isRegularImage,
    shouldUpdate,
    willUpdateBatch: willUpdate(shouldUpdate),
    tagChanges,
    usedPalette,
    usedFramePalette,

    updateForm,
    updatePalette,
    updateFramePalette,
    updateTags,
    resetTags,

    save: () => {
      batchUpdateImages({
        shouldUpdate,
        updates: {
          title,
          created,
          frame,
          lockFrame,
          rotation,
          palette: paletteRGBN || paletteShort,
          invertPalette: invertPalette || false,
          framePalette: framePaletteShort,
          invertFramePalette: invertFramePalette || false,
        },
        tagChanges,
      });
    },
    cancel: () => cancelEditImages(),
  };
};
