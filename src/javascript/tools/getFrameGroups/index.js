const getGroupName = (id, name) => {
  switch (id) {
    case 'hk':
      return 'Hallo Katze!';
    case 'int':
      return 'International Frames (GameBoy Camera)';
    case 'jp':
      return 'Japanese Frames (Pocket Camera)';
    default:
      return name;
  }
};

const prioId = (id) => {
  switch (id) {
    case 'int':
      return '_1';
    case 'jp':
      return '_2';
    case 'hk':
      return '_3';
    default:
      return id;
  }
};

const getFrameGroups = (frames) => (
  frames
    .reduce((result, { id, name }) => {
      let groupId;

      try {
        groupId = id.match(/^[a-z]{2,}/g)[0];
      } catch (error) {
        return result;
      }

      if (!result.find((group) => group.id === groupId)) {
        result.push({
          id: groupId,
          name: getGroupName(groupId, name),
        });
      }

      return result;
    }, [])
    .sort(({ id: ida }, { id: idb }) => {
      const sorta = prioId(ida);
      const sortb = prioId(idb);

      if (sorta > sortb) {
        return 1;
      }

      if (sorta < sortb) {
        return -1;
      }

      return 0;
    })
);

export default getFrameGroups;
