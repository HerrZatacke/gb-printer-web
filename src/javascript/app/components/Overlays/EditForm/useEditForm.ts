import { useEffect, useState } from 'react';
import { RGBNPalette } from 'gb-image-decoder';
import { useDispatch, useSelector } from 'react-redux';
import { missingGreyPalette } from '../../../defaults';
import { Actions } from '../../../store/actions';
import { getImageTileCount } from '../../../../tools/loadImageTiles';
import { State } from '../../../store/State';
import {
  CancelEditImagesAction,
  ImagesBatchUpdateAction,
  ImageUpdates,
} from '../../../../../types/actions/ImageActions';
import modifyTagChanges, { TagUpdateMode } from '../../../../tools/modifyTagChanges';
import { ImageMetadata, MonochromeImage, RGBNImage } from '../../../../../types/Image';
import { Rotation } from '../../../../tools/applyRotation';
import { Palette } from '../../../../../types/Palette';
import { isRGBNImage } from '../../../../tools/isRGBNImage';
import { TagChange } from '../../../../tools/applyTagChanges';

interface Batch {
  created: boolean,
  title: boolean,
  palette: boolean,
  invertPalette: boolean,
  frame: boolean,
  lockFrame: boolean,
  tags: boolean,
  rotation: boolean,
}

interface ToEdit {
  created: string,
  hash: string,
  height: number,
  imageCount: number,
  invertPalette: boolean,
  lockFrame: boolean,
  mixedTypes: boolean,
  tags: string[],
  title: string,

  frame?: string,
  hashes?: object,
  meta?: ImageMetadata,
  paletteRGBN?: RGBNPalette,
  paletteShort?: string,
  rotation?: Rotation,
}

interface StateFunctions {
  tileCounter: (hash: string) => Promise<number>,
  findPalette: (shortName: string) => Palette
}

interface Form {
  title: string,
  created: string,
  frame: string,
  lockFrame?: boolean,
  rotation?: Rotation,
  invertPalette?: boolean,
  paletteShort: string,
  paletteRGBN?: RGBNPalette,
}

interface UseEditForm {
  toEdit?: ToEdit,
  form: Form,
  isRegularImage: boolean,
  shouldUpdate: Record<keyof ImageUpdates | 'tags', boolean>,
  willUpdateBatch: string,
  tagChanges: TagChange,
  usedPalette: string[] | RGBNPalette,

  updateForm: (what: keyof Batch) => (value: string | boolean | Rotation) => void,
  updatePalette: (paletteUpdate: (string | RGBNPalette), confirm?: boolean) => void,
  updateTags: (mode: TagUpdateMode, tag: string) => void,

  save: () => void;
  cancel: () => void,
}

const willUpdate = (batch: Batch): string => ([
  batch.created ? 'date' : null,
  batch.title ? 'title' : null,
  batch.palette ? 'palette' : null,
  batch.invertPalette ? 'invertPalette' : null,
  batch.frame ? 'frame' : null,
  batch.lockFrame ? 'framePalette' : null,
  batch.tags ? 'tags' : null,
  batch.rotation ? 'rotation' : null,
]
  .filter(Boolean)
  .join(', ')
);


export const useEditForm = (): UseEditForm => {

  const {
    tileCounter,
    findPalette,
  } = useSelector((state: State): StateFunctions => ({
    tileCounter: getImageTileCount(state),
    findPalette: (shortName?: string): Palette => (
      state.palettes.find((palette) => shortName === palette.shortName) || missingGreyPalette
    ),
  }));

  const toEdit = useSelector((state: State): ToEdit | undefined => {
    if (!state.editImage) {
      return undefined;
    }

    const batch = state.editImage.batch;
    const stateTags = state.editImage.tags;

    if (!batch[0]) {
      return undefined;
    }

    const image = state.images.find(({ hash }) => hash === batch[0]);

    if (!image) {
      return undefined;
    }

    const height = (state.windowDimensions.width <= 600) ?
      state.windowDimensions.height :
      Math.min(900, state.windowDimensions.height);

    const typeCount = state.editImage.batch.reduce((acc, selHash) => {
      const tcImage = state.images.find(({ hash }) => hash === selHash);
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


    return ({
      created: image.created,
      hash: image.hash,
      height,
      imageCount: batch?.length || 0,
      invertPalette: image.invertPalette || false,
      lockFrame: image.lockFrame || false,
      mixedTypes,
      tags: stateTags,
      title: image.title,

      frame: image.frame,
      hashes: isRGBNImage(image) ? (image as RGBNImage).hashes : undefined,
      meta: image.meta,
      paletteRGBN,
      paletteShort,
      rotation: image.rotation,
    });
  });

  const [title, updateTitle] = useState<string>(toEdit?.title || '');
  const [created, updateCreated] = useState<string>(toEdit?.created || '');
  const [frame, updateFrame] = useState<string>(toEdit?.frame || '');
  const [lockFrame, updateFrameLock] = useState<boolean | undefined>(toEdit?.lockFrame);
  const [rotation, updateRotation] = useState<Rotation | undefined>(toEdit?.rotation);
  const [invertPalette, updateInvertPalette] = useState<boolean | undefined>(toEdit?.invertPalette);
  const [paletteShort, updatePaletteShort] = useState<string>(toEdit?.paletteShort || '');
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
    paletteRGBN,
  };

  const usedPalette = paletteRGBN || findPalette(paletteShort).palette;

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
    palette: false,
    invertPalette: false,
    frame: false,
    lockFrame: false,
    tags: false,
    rotation: false,
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
    if (confirm) {
      updateShouldUpdate({ ...shouldUpdate, palette: true });
    }

    if (paletteShort) {
      updatePaletteShort(paletteUpdate as string);
    } else {
      updatePaletteRGBN(paletteUpdate as RGBNPalette);
    }
  };

  const updateTags = (mode: TagUpdateMode, tag: string) => {
    updateShouldUpdate({ ...shouldUpdate, tags: true });
    updateTagChanges({
      ...tagChanges,
      ...modifyTagChanges(tagChanges, { mode, tag }),
    });
  };

  const dispatch = useDispatch();

  return {
    toEdit,
    form,
    isRegularImage,
    shouldUpdate,
    willUpdateBatch: willUpdate(shouldUpdate),
    tagChanges,
    usedPalette,

    updateForm,
    updatePalette,
    updateTags,

    save: () => {
      dispatch<ImagesBatchUpdateAction>({
        type: Actions.UPDATE_IMAGES_BATCH_CHANGES,
        payload: {
          shouldUpdate,
          updates: {
            title,
            created,
            frame,
            invertPalette,
            lockFrame,
            palette: paletteRGBN || paletteShort,
            rotation,
          },
          tagChanges,
        },
      });
    },
    cancel: () => {
      dispatch<CancelEditImagesAction>({
        type: Actions.CANCEL_EDIT_IMAGES,
      });
    },
  };
};
