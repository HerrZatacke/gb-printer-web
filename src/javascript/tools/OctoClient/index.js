import EventEmitter from 'events';
import { Octokit } from '@octokit/rest';

import dayjs from 'dayjs';
import { dateFormatReadable } from '../../app/defaults';

// Description of whole commit/upload process found here
// https://dev.to/lucis/how-to-push-files-programatically-to-a-repository-using-octokit-with-typescript-1nj0

class OctoClient extends EventEmitter {
  constructor(gitSetings = {}) {
    super();
    this.octoKit = null;
    this.busy = false;
    this.owner = null;
    this.repo = null;
    this.branch = null;
    this.token = null;
    this.progress = 0;
    this.expectedTicks = 0;
    this.setOctokit(gitSetings);
  }

  setOctokit({ use, owner, repo, branch, token }) {
    if (this.busy || !use || !owner || !repo || !branch || !token) {
      this.octoKit = null;
      this.owner = null;
      this.repo = null;
      this.branch = null;
      this.token = null;

      return;
    }

    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
    this.token = token;

    this.octoKit = new Octokit({ auth: token });
  }

  progressStart(fileCount) {
    this.busy = true;
    this.emit('starting', {
      progress: 0,
      busy: this.busy,
    });
    this.expectedTicks = fileCount + 7;
    this.progressTick();
  }

  progressTick(done = false) {
    if (!this.octoKit) {
      throw new Error('not configured');
    }

    this.progress = done ? 0 : this.progress + 1;

    this.emit('progress', {
      progress: this.progress / this.expectedTicks,
      busy: !done && this.busy,
    });
  }

  getRepoContents() {
    // eslint-disable-next-line brace-style
    try { this.progressTick(); } catch (error) { return Promise.reject(error); }

    return this.octoKit.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.branch}`,
      path: 'images',
    })
      .catch(() => ({ data: [] }))
      .then(({ data: images }) => (
        this.octoKit.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          ref: `heads/${this.branch}`,
          path: 'png',
        })
          .catch(() => ({ data: [] }))
          .then(({ data: png }) => (
            this.octoKit.repos.getContent({
              owner: this.owner,
              repo: this.repo,
              ref: `heads/${this.branch}`,
              path: 'settings.json',
            })
              .catch(() => ({ data: {} }))
              .then(({ data: { content: settings } }) => ({
                images,
                png,
                settings: JSON.parse(atob(settings)),
              }))
          ))
      ));
  }

  getCurrentCommit() {
    // eslint-disable-next-line brace-style
    try { this.progressTick(); } catch (error) { return Promise.reject(error); }

    return this.octoKit.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.branch}`,
    })
      .then(({ data: { object: { sha: commitSha } } }) => (
        this.octoKit.git.getCommit({
          owner: this.owner,
          repo: this.repo,
          commit_sha: commitSha,
        })
          .then(({ data: commitData }) => ({
            commitSha,
            treeSha: commitData.tree.sha,
          }))
      ));
  }

  createBlobForFile({ destination, blob }) {
    // eslint-disable-next-line brace-style
    try { this.progressTick(); } catch (error) { return Promise.reject(error); }

    return new Promise(((resolve) => {
      const reader = new FileReader();
      reader.onloadend = ({ target }) => {
        resolve(target.result);
      };

      reader.readAsDataURL(blob);
    }))
      .then((content) => {
        const rawContentStart = content.indexOf(';base64,') + 8;
        const rawContent = content.substr(rawContentStart);

        return this.octoKit.git.createBlob({
          owner: this.owner,
          repo: this.repo,
          content: rawContent,
          encoding: 'base64',
        })
          .then(({ data: blobData }) => ({
            filename: destination,
            blobData,
          }));
      });
  }

  createNewTree({ files, del }, parentTreeSha) {
    // eslint-disable-next-line brace-style
    try { this.progressTick(); } catch (error) { return Promise.reject(error); }

    const newFiles = files.map(({ filename, blobData: { sha } }) => ({
      path: filename,
      mode: '100644',
      type: 'blob',
      sha,
    }));

    const deleteFiles = del.map(({ path }) => ({
      path,
      mode: '100644',
      sha: null,
    }));

    return this.octoKit.git.createTree({
      owner: this.owner,
      repo: this.repo,
      tree: [...newFiles, ...deleteFiles],
      base_tree: parentTreeSha,
    })
      .then(({ data }) => data);
  }

  createNewCommit(message, currentTreeSha, currentCommitSha) {
    // eslint-disable-next-line brace-style
    try { this.progressTick(); } catch (error) { return Promise.reject(error); }

    return this.octoKit.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message,
      tree: currentTreeSha,
      parents: [currentCommitSha],
    })
      .then(({ data }) => data);
  }

  setBranchToCommit(commitSha) {
    // eslint-disable-next-line brace-style
    try { this.progressTick(); } catch (error) { return Promise.reject(error); }

    return this.octoKit.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.branch}`,
      sha: commitSha,
    })
      .then(({ data }) => data);
  }

  uploadToRepo({ files, del }) {
    // eslint-disable-next-line brace-style
    try { this.progressTick(); } catch (error) { return Promise.reject(error); }

    const commitMessage = `Sync. ${dayjs()
      .format(dateFormatReadable)}`;

    return this.getCurrentCommit()
      .then(({ treeSha, commitSha }) => (
        Promise.all(files.map((file) => (
          this.createBlobForFile(file)
        )))
          .then((filesData) => (
            this.createNewTree({
              files: filesData,
              del,
            }, treeSha)
          ))
          .then(({ sha }) => (
            this.createNewCommit(commitMessage, sha, commitSha)
          ))
          .then(({ sha }) => (
            this.setBranchToCommit(sha)
          ))
      ));
  }

  updateRemoteStore({ files = [], del = [] }) {
    if (this.busy) {
      return Promise.reject(Error('currently busy'));
    }

    // Temp
    if (!files.length && !del.length) {
      return Promise.resolve({});
    }

    this.progressStart(files.length);
    return this.uploadToRepo({ files, del })
      .then(() => {
        this.progressTick(true);
        this.busy = false;
        return {
          uploaded: files.map(({ destination }) => destination),
          deleted: del.map(({ path }) => path),
          repo: `https://github.com/${this.owner}/${this.repo}/tree/${this.branch}`,
        };
      })
      .catch((error) => {
        this.busy = false;
        this.emit('error', error);
        throw error;
      });
  }
}

export default OctoClient;
