import unique from '../unique';
import type { TagUpdates } from '../modifyTagChanges';

export interface TagChange extends TagUpdates {
  initial: readonly string[],
}

const applyTagChanges = ({ initial, add, remove }: TagChange): string[] => (
  unique([...initial, ...add])
    .filter((tag) => !remove.includes(tag))
);

export default applyTagChanges;
