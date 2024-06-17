import { useSelector } from 'react-redux';
import type { State } from '../../../store/State';

interface UseProgressBox {
  progress: number,
  message: string,
}

export const useProgressBox = (): UseProgressBox => (
  useSelector((state: State) => {
    if (state.progress.gif) {
      return ({
        progress: state.progress.gif,
        message: 'Creating GIF animation...',
      });
    }

    if (state.progress.plugin) {
      return ({
        progress: state.progress.plugin,
        message: 'Executing plugin...',
      });
    }

    if (state.progress.printer) {
      return ({
        progress: state.progress.printer,
        message: 'Fetching images from printer...',
      });
    }

    return { progress: 0, message: '' };
  })
);
