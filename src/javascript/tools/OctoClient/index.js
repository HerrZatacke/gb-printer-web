import EventEmitter from 'events';
import { Octokit } from '@octokit/rest';

import dayjs from 'dayjs';
import { dateFormatReadable } from '../../app/defaults';

// Description of whole commit/upload process found here
// https://dev.to/lucis/how-to-push-files-programatically-to-a-repository-using-octokit-with-typescript-1nj0

class OctoClient extends EventEmitter {
  constructor(gitSetings = {}, addToQueue) {
    super();
    this.octoKit = null;
    this.busy = false;
    this.owner = null;
    this.repo = null;
    this.branch = null;
    this.throttle = null;
    this.token = null;
    this.progress = 0;
    this.queueLength = 0;
    this.addToQueue = addToQueue;
    this.setOctokit(gitSetings);
  }

  setOctokit({ use, owner, repo, branch, throttle, token }) {
    if (this.busy || !use || !owner || !repo || !branch || !throttle || !token) {
      this.octoKit = null;
      this.owner = null;
      this.repo = null;
      this.branch = null;
      this.throttle = null;
      this.token = null;

      return;
    }

    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
    this.throttle = Math.max(parseInt(throttle, 10) || 0, 10);
    this.token = token;

    this.octoKit = new Octokit({ auth: token });
  }

  progressStart(fileCount) {
    this.queueLength = fileCount + 7;
    this.emit('starting', {
      progress: 0,
      queueLength: this.queueLength,
    });
    this.progressTick();
  }

  progressTick(done = false) {
    this.progress = done ? 0 : this.progress + 1;

    this.emit('progress', {
      progress: this.progress,
      queueLength: this.queueLength,
    });

    if (done) {
      this.queueLength = 0;
    }
  }

  getRepoContents() {
    this.progressTick();

    const get = [
      { path: 'images', value: [] },
      { path: 'palettes', value: [] },
      { path: 'png', value: [] },
      { path: 'frames', value: [] },
      { path: 'settings.json', value: {} },
    ];

    return this.addToQueue('repos.getContent /', this.throttle, () => ( // queue wrapper
      this.octoKit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${this.branch}`,
        path: '',
      })
    )) // queue wrapper
      .then(({ data: root }) => (
        Promise.all(get.map(({ path, value }) => {

          if (!root.find(({ path: foundPath }) => foundPath === path)) {
            return Promise.resolve({ path, value });
          }

          return this.addToQueue(`repos.getContent /${path}`, this.throttle, () => ( // queue wrapper
            this.octoKit.repos.getContent({
              owner: this.owner,
              repo: this.repo,
              ref: `heads/${this.branch}`,
              path,
            })
          )) // queue wrapper
            .then(({ data }) => ({
              path,
              value: data.type === 'file' ? JSON.parse(atob(data.content)) : data,
            }))
            .catch(() => ({ path, value }));

        }))
          .then((received) => ({
            images: received.find(({ path }) => path === 'images').value,
            palettes: received.find(({ path }) => path === 'palettes').value,
            png: received.find(({ path }) => path === 'png').value,
            frames: received.find(({ path }) => path === 'frames').value,
            settings: received.find(({ path }) => path === 'settings.json').value,
          }))
      ));
  }

  getBlob(sha) {
    this.progressTick();

    return this.addToQueue(`git.getBlob ${sha}`, this.throttle, () => ( // queue wrapper
      this.octoKit.git.getBlob({
        owner: this.owner,
        repo: this.repo,
        file_sha: sha,
      })
    )) // queue wrapper
      .then(({ data: { content } }) => atob(content));
  }

  getCurrentCommit() {
    this.progressTick();

    return this.addToQueue(`git.getRef heads/${this.branch}`, this.throttle, () => ( // queue wrapper
      this.octoKit.git.getRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${this.branch}`,
      })
    )) // queue wrapper
      .then(({ data: { object: { sha: commitSha } } }) => (
        this.addToQueue(`git.getCommit ${commitSha}`, this.throttle, () => ( // queue wrapper
          this.octoKit.git.getCommit({
            owner: this.owner,
            repo: this.repo,
            commit_sha: commitSha,
          })
        )) // queue wrapper
          .then(({ data: commitData }) => ({
            commitSha,
            treeSha: commitData.tree.sha,
          }))
      ));
  }

  createBlobForFile({ destination, blob }, index, total) {
    this.progressTick();

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

        return this.addToQueue(`git.createBlob (${index + 1}/${total}) ${destination}`, this.throttle, () => ( // queue wrapper
          this.octoKit.git.createBlob({
            owner: this.owner,
            repo: this.repo,
            content: rawContent,
            encoding: 'base64',
          })
        )) // queue wrapper
          .then(({ data: blobData }) => ({
            filename: destination,
            blobData,
          }));
      });
  }

  createNewTree({ files, del }, parentTreeSha) {
    this.progressTick();

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

    return this.addToQueue(`git.createTree ${parentTreeSha}`, this.throttle, () => ( // queue wrapper
      this.octoKit.git.createTree({
        owner: this.owner,
        repo: this.repo,
        tree: [...newFiles, ...deleteFiles],
        base_tree: parentTreeSha,
      })
    )) // queue wrapper
      .then(({ data }) => data);
  }

  createNewCommit(message, currentTreeSha, currentCommitSha) {
    this.progressTick();

    return this.addToQueue(`git.createCommit ${message}`, this.throttle, () => ( // queue wrapper
      this.octoKit.git.createCommit({
        owner: this.owner,
        repo: this.repo,
        message,
        tree: currentTreeSha,
        parents: [currentCommitSha],
      })
    )) // queue wrapper
      .then(({ data }) => data);
  }

  setBranchToCommit(commitSha) {
    this.progressTick();

    return this.addToQueue(`git.updateRef ${commitSha}`, this.throttle, () => ( // queue wrapper
      this.octoKit.git.updateRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${this.branch}`,
        sha: commitSha,
      })
    )) // queue wrapper
      .then(({ data }) => data);
  }

  uploadToRepo({ upload, del }) {
    if (!this.octoKit) {
      return Promise.reject(new Error('OctoClient not configured'));
    }

    const commitMessage = `Sync. ${dayjs().format(dateFormatReadable)}`;

    const uploadLength = upload.length;

    return this.getCurrentCommit()
      .then(({ treeSha, commitSha }) => (
        Promise.all(upload.map((file, index) => (
          this.createBlobForFile(file, index, uploadLength)
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

  updateRemoteStore({ upload = [], del = [] }) {
    if (this.busy) {
      return Promise.reject(Error('currently busy'));
    }

    // Temp
    if (!upload.length && !del.length) {
      return Promise.resolve({});
    }

    this.progressStart(upload.length);
    this.busy = true;

    return this.uploadToRepo({ upload, del })
      .then(() => {
        this.progressTick(true);
        this.busy = false;
        return {
          uploaded: upload.map(({ destination }) => destination),
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
