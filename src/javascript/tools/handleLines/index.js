const handleLines = (rawLine) => {
  // commented lines are not saved
  if ((rawLine.charAt(0) === '#')) {
    return null;
  }

  // ! indicates a command
  if ((rawLine.charAt(0) === '!')) {
    try {
      const { command, margin_lower: marginLower } = JSON.parse(rawLine.slice(1).trim());
      // if (command === 'INIT') {
      //   return {
      //     type: 'CLEAR_LINES',
      //   };
      // }

      if (command === 'PRNT' && marginLower > 0) {
        return {
          type: 'IMAGE_COMPLETE',
        };
      }
    } catch (error) {
      return {
        type: 'PARSE_ERROR',
        payload: 'Error while trying to parse JSON data command block',
      };
    }

    return null;
  }

  return {
    type: 'NEW_LINE',
    payload: rawLine,
  };
};

export default handleLines;
