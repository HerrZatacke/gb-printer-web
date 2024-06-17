import { localforageFrames } from '../localforageInstance';

import { Frame } from '../../../types/Frame';

interface BackupFrame extends Frame {
  data: string | null,
}

const backupFrames = async (oldFrames: Frame[]): Promise<void> => {
  if (!localStorage.getItem('gbp-backup-frames')) {
    const backup: BackupFrame[] = await Promise.all(
      oldFrames.map(async (frame): Promise<BackupFrame> => ({
        ...frame,
        data: await localforageFrames.getItem(frame.id),
      })),
    );

    localStorage.setItem('gbp-backup-frames', JSON.stringify(backup));
    // eslint-disable-next-line no-console
    console.log('Frame backup created', backup);
  }
};

export default backupFrames;
