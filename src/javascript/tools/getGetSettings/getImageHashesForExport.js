const getImageHashesForExport = (what, { images, imageSelection }) => {

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
