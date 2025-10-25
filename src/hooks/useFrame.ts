import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useStores } from '@/hooks/useStores';
import useDialogsStore from '@/stores/dialogsStore';
import useEditStore from '@/stores/editStore';
import useItemsStore from '@/stores/itemsStore';
import applyFrame from '@/tools/applyFrame';
import { loadFrameData } from '@/tools/applyFrame/frameData';
import textToTiles from '@/tools/textToTiles';

interface GetTilesParams {
  frameId: string,
  frameHash: string,
  name: string,
}

interface UseFrameParams {
  frameId: string,
  name: string,
}

interface UseFrame {
  frameHash: string,
  tiles: string[],
  imageStartLine: number,
  setTiles: (tiles: string[]) => void,
  deleteFrame: () => void,
  editFrame: () => void,
  usage: number,
}

const getTiles = ({ frameId, frameHash, name }: GetTilesParams) => {
  const text = `\n  frameId: ${frameId}\n\n  ${name}\n\n${frameHash}`;
  return applyFrame(textToTiles(text), frameHash);
};

const useFrame = ({ frameId, name }: UseFrameParams): UseFrame => {
  const t = useTranslations('useFrame');
  const [tiles, setTiles] = useState<string[]>([]);
  const [imageStartLine, setImageStartLine] = useState<number>(2);

  const { setEditFrame } = useEditStore();
  const { dismissDialog, setDialog } = useDialogsStore();
  const { frames, deleteFrame, images } = useItemsStore();
  const { updateLastSyncLocalNow } = useStores();

  const frameHash = frames.find(({ id }) => id === frameId)?.hash || '';
  const usage = useMemo(() => (
    images.filter(({ frame }) => frame === frameId).length
  ), [frameId, images]);

  useEffect(() => {
    setImageStartLine(2);
    setTiles([]);

    const get = async () => {
      if (!frameHash) {
        return;
      }

      const frameData = await loadFrameData(frameHash);
      const newTiles = await getTiles({ frameId, frameHash, name });

      setImageStartLine(frameData ? frameData.upper.length / 20 : 2);
      setTiles(newTiles);
    };

    get();
  }, [frameId, frameHash, name]);

  return {
    frameHash,
    tiles,
    imageStartLine,
    usage,
    setTiles,
    deleteFrame: () => {
      setDialog({
        message: t('deleteConfirmation', { name, frameId }),
        confirm: async () => {
          dismissDialog(0);
          updateLastSyncLocalNow();
          deleteFrame(frameId);
        },
        deny: async () => dismissDialog(0),
      });
    },
    editFrame: () => setEditFrame(frameId),
  };
};

export default useFrame;
