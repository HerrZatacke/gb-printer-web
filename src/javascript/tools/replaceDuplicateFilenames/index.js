const replaceDuplicateFilenames = (files) => {

  const filenames = [];

  return files.map((file) => {
    const { filename } = file;
    const fnParts = filename.split('.');
    const ext = fnParts.pop();
    const baseName = fnParts.join('.');
    let uFilename = filename;
    let tries = 0;

    while (filenames.includes(uFilename)) {
      tries += 1;
      uFilename = `${baseName}_(${tries}).${ext}`;
    }

    if (!filenames.includes(uFilename)) {
      filenames.push(uFilename);
    }

    return {
      ...file,
      uFilename,
    };
  });
};

export default replaceDuplicateFilenames;
