const filterDeleteNew = ({ images, frames }, toUpload, toKeep, missingLocally) => ({
  // remove all files from upload queue if they already exist remotely
  upload: toUpload.filter(({ destination }) => (
    !images.find(({ path }) => path === destination) &&
    // !palettes.find(({ path }) => path === destination) &&
    !frames.find(({ path }) => path === destination)
  )),
  del: [

    ...[
      ...images,
    ]
      .filter(({ path }) => (
        !toKeep.find(({ destination }) => path === destination) &&
        !toUpload.find(({ destination }) => path === destination) &&
        !missingLocally.find((hash) => path.indexOf(hash) >= -1)
      )),

    ...[
      // ...palettes,
      ...frames,
    ].filter(({ path }) => (
      !toKeep.find(({ destination }) => path === destination) &&
      !toUpload.find(({ destination }) => path === destination)
    )),

  ],
});

export default filterDeleteNew;
