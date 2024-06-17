import type { ImportLine } from './types';
import { HandleLine } from './types';


const handleLines = (rawLine: string): ImportLine | null => {
  // commented lines are not saved
  if (
    (rawLine.charAt(0) === '#') ||
    (rawLine.charAt(0) === '/')
  ) {
    return null;
  }

  // ! or { indicates a command
  if (
    (rawLine.charAt(0) === '!') ||
    (rawLine.charAt(0) === '{')
  ) {
    try {
      const { command, margin_lower: marginLower } = JSON.parse(rawLine.slice(rawLine.indexOf('{')).trim());
      // if (command === 'INIT') {
      //   return {
      //     type: CLEAR_LINES,
      //   };
      // }

      if (command === 'PRNT' && marginLower > 0) {
        return {
          type: HandleLine.IMAGE_COMPLETE,
        };
      }
    } catch (error) {
      return {
        type: HandleLine.PARSE_ERROR,
        payload: 'Error while trying to parse JSON data command block',
      };
    }

    return null;
  }

  const cleanLine = rawLine.replace(/[^0-9A-F]/ig, '');

  if (!cleanLine.length) {
    return null;
  }

  return {
    type: HandleLine.NEW_LINES,
    payload: [cleanLine],
  };
};

export default handleLines;
