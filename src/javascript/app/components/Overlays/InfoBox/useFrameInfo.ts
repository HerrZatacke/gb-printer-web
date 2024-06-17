import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../../store/actions';
import type { State } from '../../../store/State';
import type { FramesMessageHideAction } from '../../../../../types/actions/GlobalActions';

interface UseFrameInfo {
  message?: {
    headline: string,
    text: string[],
  }
  dismiss: () => void,
}

export const useFrameInfo = (): UseFrameInfo => {
  const framesMessage = useSelector((state: State) => state.framesMessage);
  const dispatch = useDispatch();

  const message = framesMessage === 1 ? {
    headline: 'You might be temporarily missing some frames',
    text: [
      'In a recent change the pre-compiled frames have been removed from this application.',
      'The application now however gives you the opportunity to add all frames you like by yourself and also share them with others.',
      'Maybe you have designed some frames by yourself, or you have aquired some previously unknown frames.',
      'To see how you can add the frames, check the "Frames" explanation on the startpage of this app.',
    ],
  } : undefined;

  return {
    message,
    dismiss: () => {
      dispatch<FramesMessageHideAction>({
        type: Actions.FRAMES_MESSAGE_HIDE,
      });
    },
  };
};
