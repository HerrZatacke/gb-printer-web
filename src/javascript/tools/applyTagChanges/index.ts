interface TagChange {
  initial: string[],
  add: string[],
  remove: string[],
}

const applyTagChanges = ({ initial, add, remove }: TagChange): string[] => {
  const tagsAdded = [...initial, ...add];

  return tagsAdded
    .filter((tag, index) => (
      tagsAdded.findIndex((findTag) => findTag === tag) === index
    ))
    .filter((tag) => !remove.includes(tag));
};

export default applyTagChanges;
