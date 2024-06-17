interface OldFile {
  blob: Blob,
}

export interface PreparedFile {
  file: File,
  contentType: string,
}

const prepareFile = (fileData: File | OldFile): PreparedFile => {
  if ((fileData as OldFile).blob) {
    throw new Error('Incompatible fileData.\nSorry.\nYou need to upgrade your wifi printer emulator!');
  }

  const file = fileData as File;
  const contentType = file.type;

  if (!file.size) {
    throw new Error('empty file');
  }

  return {
    file,
    contentType,
  };
};

export default prepareFile;
