import dayjs from 'dayjs';
import { dateFormat } from '../../../tools/values';

const saveRGBNImage = (store) => (next) => (action) => {

  if (action.type === 'SAVE_RGBN_IMAGE') {

    const state = store.getState();

    import(/* webpackChunkName: "object-hash" */ 'object-hash')
      .then(({ default: hash }) => {
        const image = {
          hashes: { ...state.rgbnImages },
          hash: hash(state.rgbnImages),
          created: dayjs().format(dateFormat),
          title: '',
          index: state.globalIndex,
        };

        store.dispatch({
          type: 'ADD_IMAGE',
          payload: image,
        });
      });

  }

  next(action);
};

export default saveRGBNImage;
