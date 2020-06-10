const getFilteredImages = ({ images, filter: { activeTags } }) => (
  images.filter((image) => {

    if (activeTags.length) {
      if (image.tags.find((tag) => activeTags.includes(tag))) {
        return true;
      }

      return false;
    }

    return true;
  })
);

export default getFilteredImages;
