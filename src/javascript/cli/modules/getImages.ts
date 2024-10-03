import type { RomBank } from '../../tools/transformRom';
import getImportSav from '../../tools/transformSav/importSav';
import { Actions } from '../../app/store/actions';
import type { ImportQueueAddMultiAction } from '../../../types/actions/QueueActions';
import type { ImportItem } from '../../../types/ImportItem';

export const getImages = async (bank: RomBank, bankIndex: number): Promise<ImportItem[]> => {
  const images: ImportItem[] = [];

  const importSav = getImportSav({
    importLastSeen: false,
    importDeleted: false,
    forceMagicCheck: false,
    data: bank.bankData,
    lastModified: Date.now(),
    frames: [],
    fileName: `bank ${bankIndex}`,
    dispatch: (action) => {
      if (action.type === Actions.IMPORTQUEUE_ADD_MULTI) {
        const ac = action as unknown as ImportQueueAddMultiAction;
        images.push(...ac.payload);
      }

      return action;
    },
  });

  if (importSav) {
    await importSav('', false);
  }

  return images;
};
