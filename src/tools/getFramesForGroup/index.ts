import type { Frame } from '@/types/Frame';

export const getFramesForGroup = (frames: Frame[], groupName: string): Frame[] => (
  frames.reduce((acc: Frame[], frame: Frame): Frame[] => {
    const frameGroupIdRegex = /^(?<group>[a-z]+)(?<id>[0-9]+)/g;
    const group = frameGroupIdRegex.exec(frame.id)?.groups?.group;
    return (groupName === group) ? [...acc, frame] : acc;
  }, [])
);
