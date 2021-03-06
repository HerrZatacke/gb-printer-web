const modifyTagChanges = (initial, { mode, tag }) => {
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
      return {};
  }
};

export default modifyTagChanges;
