// ToDo: is an update possible for PNGs if palette has changed
const filterDeleteNew = ({ images, png, palettes, frames }, files, missingLocally) => ({
  // remove all files from upload queue if they already exist remotely
  upload: files.filter(({ destination }) => (
    !images.find(({ path }) => path === destination) &&
    !palettes.find(({ path }) => path === destination) &&
    !png.find(({ path }) => path === destination) &&
    !frames.find(({ path }) => path === destination)
  )),
  del: [

    ...[
      ...images,
      ...png,
    ]
      .filter(({ path }) => (
        !files.find(({ destination }) => path === destination) &&
        !missingLocally.find((hash) => path.indexOf(hash) >= -1)
      )),

    ...[
      ...palettes,
      ...frames,
    ].filter(({ path }) => (
      !files.find(({ destination }) => path === destination)
    )),

  ],
});

export default filterDeleteNew;
