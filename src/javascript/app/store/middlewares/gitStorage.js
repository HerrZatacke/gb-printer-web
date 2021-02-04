import { Octokit } from '@octokit/rest';
import dayjs from 'dayjs';
import { load } from '../../../tools/storage';
import { dateFormatReadable } from '../../defaults';
// https://dev.to/lucis/how-to-push-files-programatically-to-a-repository-using-octokit-with-typescript-1nj0

const createNewTree = async (octo, owner, repo, blobs, paths, parentTreeSha) => {
  // My custom config. Could be taken as parameters
  const tree = blobs.map(({ sha }, index) => ({
    path: paths[index],
    mode: '100644',
    type: 'blob',
    sha,
  }));
  const { data } = await octo.git.createTree({
    owner,
    repo,
    tree,
    base_tree: parentTreeSha,
  });
  return data;
};

const createNewCommit = async (octo, owner, repo, message, currentTreeSha, currentCommitSha) => {
  const { data } = await octo.git.createCommit({
    owner,
    repo,
    message,
    tree: currentTreeSha,
    parents: [currentCommitSha],
  });
  return data;
};

const setBranchToCommit = (octo, owner, repo, branch, commitSha) => (
  octo.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: commitSha,
  })
);

const getCurrentCommit = async (octo, owner, repo, branch) => {
  const { data: refData } = await octo.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });
  const commitSha = refData.object.sha;
  const { data: commitData } = await octo.git.getCommit({
    owner,
    repo,
    commit_sha: commitSha,
  });
  return {
    commitSha,
    treeSha: commitData.tree.sha,
  };
};

const createBlobForFile = (octo, owner, repo) => async ({ tiles }) => {
  const blobData = await octo.git.createBlob({
    owner,
    repo,
    // content: btoa(content),
    // encoding: 'base64',
    content: tiles.join('\n'),
    encoding: 'utf-8',
  });
  return blobData.data;
};

const uploadToRepo = async (octo, { owner, repo, branch }, imagesData) => {
  const { treeSha, commitSha } = await getCurrentCommit(octo, owner, repo, branch);
  const filesBlobs = await Promise.all(imagesData.map(createBlobForFile(octo, owner, repo)));
  const pathsForBlobs = imagesData.map(({ hash }) => `images/${hash}.txt`);
  const newTree = await createNewTree(
    octo,
    owner,
    repo,
    filesBlobs,
    pathsForBlobs,
    treeSha,
  );

  const commitMessage = `Sync. ${dayjs().format(dateFormatReadable)}`;
  const newCommit = await createNewCommit(
    octo,
    owner,
    repo,
    commitMessage,
    newTree.sha,
    commitSha,
  );
  await setBranchToCommit(octo, owner, repo, branch, newCommit.sha);
};


const initOctokit = ({
  use,
  owner,
  repo,
  branch,
  token,
}) => {
  if (!use || !owner || !repo || !branch || !token) {
    return null;
  }

  return new Octokit({ auth: token });
};

const gitStorage = (store) => {
  const { gitStorage: gitStorageSettings } = store.getState();

  const octokit = initOctokit(gitStorageSettings);


  return (next) => (action) => {

    const { images } = store.getState();

    if (action.type === 'TEST_TEST') {

      Promise.all(
        images
          .filter(({ hashes }) => (!hashes))
          .map((image) => (
            load(image.hash)
              .then((tiles) => ({
                ...image,
                tiles,
              }))
          )),
      )
        .then((imagesData) => {
          uploadToRepo(octokit, gitStorageSettings, imagesData)
            .then(() => console.log('done'));
        });
    }

    next(action);
  };
};

export default gitStorage;
