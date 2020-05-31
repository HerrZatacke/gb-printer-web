import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const imageR = state.images.find((img) => img.hash === state.rgbnImages.r);
  const imageG = state.images.find((img) => img.hash === state.rgbnImages.g);
  const imageB = state.images.find((img) => img.hash === state.rgbnImages.b);
  const imageN = state.images.find((img) => img.hash === state.rgbnImages.n);

  return ({
    hashes: {
      r: state.rgbnImages.r,
      g: state.rgbnImages.g,
      b: state.rgbnImages.b,
      n: state.rgbnImages.n,
    },
    frames: {
      r: imageR ? imageR.frame : null,
      g: imageG ? imageG.frame : null,
      b: imageB ? imageB.frame : null,
      n: imageN ? imageN.frame : null,
    },
  });
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps);
