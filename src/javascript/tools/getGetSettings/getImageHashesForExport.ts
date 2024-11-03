import type { State } from '../../app/store/State';

const getImageHashesForExport = (what: 'images' | 'selected_images', { images }: State, imageSelection: string[]): string[] => {

  switch (what) {
    case 'images':
      // export all images
      return images.map(({ hash }) => hash);
    case 'selected_images':
      // export selected only
      return imageSelection;
    default:
      return [];
  }
};

export default getImageHashesForExport;
