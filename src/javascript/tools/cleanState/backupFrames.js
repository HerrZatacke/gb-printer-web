import { localforageFrames } from '../localforageInstance';

const backupFrames = async (oldFrames) => {
  if (!localStorage.getItem('gbp-backup-frames')) {
    const backup = await Promise.all(
      oldFrames.map(async (frame) => ({
        ...frame,
        data: await localforageFrames.getItem(frame.id),
      })),
    );

    localStorage.setItem('gbp-backup-frames', JSON.stringify(backup));
    // eslint-disable-next-line no-console
    console.log('Frame backup created', JSON.parse(localStorage.getItem('gbp-backup-frames')));
  }
};

export default backupFrames;
