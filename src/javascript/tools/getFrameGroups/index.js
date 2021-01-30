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
);

export default getFrameGroups;
