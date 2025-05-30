import type { TagUpdates } from '@/tools/modifyTagChanges';
import unique from '../unique';

export interface TagChange extends TagUpdates {
  initial: readonly string[],
}

const applyTagChanges = ({ initial, add, remove }: TagChange): string[] => (
  unique([...initial, ...add])
    .filter((tag) => !remove.includes(tag))
);

export default applyTagChanges;
