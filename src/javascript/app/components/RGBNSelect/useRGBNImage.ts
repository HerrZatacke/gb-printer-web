import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import { State } from '../../store/State';
import { UpdateRGBNPartAction } from '../../store/reducers/rgbnImagesReducer';
import { RGBNHashes } from '../../../../types/Image';

interface UseRGBNImage {
  isR: boolean,
  isG: boolean,
  isB: boolean,
  isN: boolean,
  updateRGBN: (part: keyof RGBNHashes, checked: boolean) => void,
}

export const useRGBNImage = (hash: string): UseRGBNImage => {
  const rgbnImages = useSelector((state: State) => state.rgbnImages);
  const dispatch = useDispatch();

  return {
    isR: rgbnImages?.r === hash,
    isG: rgbnImages?.g === hash,
    isB: rgbnImages?.b === hash,
    isN: rgbnImages?.n === hash,
    updateRGBN: (part: keyof RGBNHashes, checked: boolean) => {
      dispatch({
        type: Actions.UPDATE_RGBN_PART,
        payload: {
          [part]: checked ? hash : '',
        },
      } as UpdateRGBNPartAction);
    },
  };
};
