import unique from '../unique';

interface TagChange {
  initial: string[],
  add: string[],
  remove: string[],
}

const applyTagChanges = ({ initial, add, remove }: TagChange): string[] => (
  unique([...initial, ...add])
    .filter((tag) => !remove.includes(tag))
);

export default applyTagChanges;
