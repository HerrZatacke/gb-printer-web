const getImagePalette = ({ palettes }, { hashes, palette }) => (
  (!hashes) ? palettes.find(({ shortName }) => shortName === palette) : palette
);

export default getImagePalette;
