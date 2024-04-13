enum TagUpdateMode {
  ADD = 'add',
  REMOVE = 'remove',
}

interface TagUpdates {
  add: string[],
  remove: string[],
}

const modifyTagChanges = (initial: TagUpdates, { mode, tag }: { mode: TagUpdateMode, tag: string }): TagUpdates => {
  switch (mode) {
    case 'add':
      return {
        add: [...initial.add, tag],
        remove: [...initial.remove.filter((t) => t !== tag)],
      };
    case 'remove':
      return {
        remove: [...initial.remove, tag],
        add: [...initial.add.filter((t) => t !== tag)],
      };
    default:
      return initial;
  }
};

export default modifyTagChanges;
