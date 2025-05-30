import type { KeepFile, UploadFile } from '../../../types/Sync';
import type { RepoContents, RepoTasks } from '../../../types/Export';

const filterDeleteNew = (
  { images, frames }: RepoContents,
  toUpload: UploadFile[],
  toKeep: KeepFile[],
  missingLocally: string[],
): RepoTasks => {

  const delImages = images.filter(({ path }) => (
    !toKeep.find(({ destination }) => path === destination) &&
    !toUpload.find(({ destination }) => path === destination) &&
    !missingLocally.find((hash) => path.indexOf(hash) >= -1)
  ));

  const delFrames = frames.filter(({ path }) => (
    !toKeep.find(({ destination }) => path === destination) &&
    !toUpload.find(({ destination }) => path === destination)
  ));

  return ({
    // remove all files from upload queue if they already exist remotely
    upload: toUpload.filter(({ destination }) => (
      !images.find(({ path }) => path === destination) &&
      // !palettes.find(({ path }) => path === destination) &&
      !frames.find(({ path }) => path === destination)
    )),
    del: [
      ...delImages,
      ...delFrames,
    ],
  });
};

export default filterDeleteNew;
