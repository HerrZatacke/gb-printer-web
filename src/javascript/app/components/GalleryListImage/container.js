import { connect } from 'react-redux';

const mapStateToProps = (state, { hash }) => {
  const image = state.images.find((img) => img.hash === hash);
  let palette;

  if (image.hashes) {
    palette = image.rgbnPalette;
  } else {
    palette = state.palettes.find(({ shortName }) => shortName === image.palette);
  }

  return ({
    title: image.title,
    created: image.created,
    index: image.index,
    hashes: image.hashes,
    palette,
  });
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
