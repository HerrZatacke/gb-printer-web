import screenfull from 'screenfull';
import useInteractionsStore from '../../app/stores/interactionsStore';
import useItemsStore from '../../app/stores/itemsStore';

export const initLightbox = () => {
  const {
    setWindowDimensions,
    setLightboxImage,
    setLightboxImageNext,
    setLightboxImagePrev,
    setIsFullscreen,
  } = useInteractionsStore.getState();

  const { images } = useItemsStore.getState();

  window.addEventListener('resize', setWindowDimensions);

  if (screenfull.isEnabled) {
    screenfull.on('change', () => {
      setIsFullscreen(!!screenfull.element);
    });
  }

  document.addEventListener('keydown', (ev) => {
    const { lightboxImage } = useInteractionsStore.getState();
    if (lightboxImage === null) {
      return;
    }

    switch (ev.key) {
      case 'Esc':
      case 'Escape':
        setLightboxImage(null);
        ev.preventDefault();
        break;

      case 'Right':
      case 'ArrowRight':
        setLightboxImageNext(images.length);
        ev.preventDefault();
        break;

      case 'Left':
      case 'ArrowLeft':
        setLightboxImagePrev();
        ev.preventDefault();
        break;

      default:
        break;
    }
  });
};
