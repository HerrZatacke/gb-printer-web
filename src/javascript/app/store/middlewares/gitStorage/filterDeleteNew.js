// ToDo: is an update possible for PNGs if palette has changed
const filterDeleteNew = ({ images, png, palettes }, files, missingLocally) => ({
  // remove all files from upload queue if they already exist remotely
  upload: files.filter(({ destination }) => (
    !images.find(({ path }) => path === destination) &&
    !palettes.find(({ path }) => path === destination) &&
    !png.find(({ path }) => path === destination)
  )),
  del: [...images, ...png, ...palettes].filter(({ path }) => (
    !files.find(({ destination }) => path === destination) &&
    !missingLocally.find((hash) => path.indexOf(hash) >= -1)
  )),
});

export default filterDeleteNew;
