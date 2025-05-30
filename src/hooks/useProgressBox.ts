import useInteractionsStore from '../app/stores/interactionsStore';

interface UseProgressBox {
  progress: number,
  message: string,
}

export const useProgressBox = (): UseProgressBox => {
  const { progress } = useInteractionsStore();

  if (progress.gif) {
    return ({
      progress: progress.gif,
      message: 'Creating GIF animation...',
    });
  }

  if (progress.plugin) {
    return ({
      progress: progress.plugin,
      message: 'Executing plugin...',
    });
  }

  if (progress.printer) {
    return ({
      progress: progress.printer,
      message: 'Fetching images from printer...',
    });
  }

  return {
    progress: 0,
    message: '',
  };
};
