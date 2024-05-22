import EventEmitter from 'events';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';

import dayjs from 'dayjs';
import dateFormatLocale from '../dateFormatLocale';
import { GitStorageSettings } from '../../../types/actions/StorageActions';
import { AddToQueueFn, RepoFile, RepoTasks, UploadFile } from '../../../types/Sync';
import readFileAs, { ReadAs } from '../readFileAs';

interface GitFile {
  path?: string | undefined,
  mode?: string | undefined,
  type?: string | undefined,
  sha?: string | undefined,
  size?: number | undefined,
  url?: string | undefined
}

interface GitCurrentCommit {
  commitSha: string,
  treeSha: string,
}

interface GitBlobFile {
  filename: string,
  blobData: {
    url: string,
    sha: string,
  }
}

interface GitUploadResult {
  uploaded?: string[],
  deleted?: string[],
  repo?: string,
}

interface GitCreateTree {
  path?: string;
  mode?: '100644' | '100755' | '040000' | '160000' | '120000';
  type?: 'blob' | 'tree' | 'commit';
  sha?: string | null;
  content?: string;
}

// Description of whole commit/upload process found here
// https://dev.to/lucis/how-to-push-files-programatically-to-a-repository-using-octokit-with-typescript-1nj0

class OctoClient extends EventEmitter {
  octoKit: Octokit | null;
  busy: boolean;
  owner: string;
  repo: string;
  branch: string;
  throttle: number;
  token: string | null;
  progress: number;
  queueLength: number;
  addToQueue: AddToQueueFn<unknown>;
  getPreferredLocale: () => string;

  constructor(gitSetings: GitStorageSettings, getPreferredLocale: () => string, addToQueue: AddToQueueFn<unknown>) {
    super();
    this.octoKit = null;
    this.busy = false;
    this.owner = '';
    this.repo = '';
    this.branch = '';
    this.throttle = 10;
    this.token = null;
    this.progress = 0;
    this.queueLength = 0;
    this.addToQueue = addToQueue;
    this.getPreferredLocale = getPreferredLocale;
    this.setOctokit(gitSetings || {});
  }

  setOctokit({ use, owner, repo, branch, throttle, token }: Partial<GitStorageSettings>) {
    if (this.busy || !use || !owner || !repo || !branch || !throttle || !token) {
      this.octoKit = null;
      this.owner = '';
      this.repo = '';
      this.branch = '';
      this.throttle = 10;
      this.token = null;

      return;
    }

    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
    this.throttle = Math.max(throttle, 10) || 10;
    this.token = token;

    this.octoKit = new Octokit({ auth: token });
  }

  progressStart(fileCount: number) {
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

  async getRepoContents() {
    this.progressTick();

    const { data: { commit: { sha: commitSha } } } = (await this.addToQueue(`repos.getBranch ${this.branch}`, this.throttle, () => (
      this.octoKit?.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: this.branch,
      }) as Promise<unknown>
    )) as RestEndpointMethodTypes['repos']['getBranch']['response']);

    const { data: { tree: { sha: treeSha } } } = (await this.addToQueue(`git.getCommit ${commitSha}`, this.throttle, () => (
      this.octoKit?.git.getCommit({
        owner: this.owner,
        repo: this.repo,
        commit_sha: commitSha,
      }) as Promise<unknown>
    )) as RestEndpointMethodTypes['git']['getCommit']['response']);

    const { data: { tree } } = (await this.addToQueue(`git.getTree ${treeSha}`, this.throttle, () => (
      this.octoKit?.git.getTree({
        owner: this.owner,
        repo: this.repo,
        tree_sha: treeSha,
        recursive: '1',
      }) as Promise<unknown>
    )) as RestEndpointMethodTypes['git']['getTree']['response']);

    const settingsFile: GitFile | undefined = tree.find(({ path }: GitFile) => path === 'settings.json');
    const images = this.augmentFileList('images', tree.filter(({ path }: GitFile) => path?.startsWith('images/')));
    const frames = this.augmentFileList('frames', tree.filter(({ path }: GitFile) => path?.startsWith('frames/')));

    const settingsContent = settingsFile?.sha ? await this.getFileContent(settingsFile.sha, 0, 1) : '{}';

    return {
      images,
      frames,
      settings: JSON.parse(settingsContent),
    };
  }

  augmentFileList(type: 'images' | 'frames', files: GitFile[]): RepoFile[] {
    return files.reduce((acc: RepoFile[], { path, sha }: GitFile, index: number): RepoFile[] => {
      if (!path || !sha) {
        return acc;
      }

      const name = path.split('/').pop() || '';

      let hash: string;
      switch (type) {
        case 'images':
          hash = name.split('.')[0];
          break;
        case 'frames':
          hash = name.split('.')[0];
          break;
        default:
          hash = '-';
      }

      const augmentedFile: RepoFile = {
        path,
        name,
        hash,
        getFileContent: () => this.getFileContent(sha, index, files.length),
      };

      return [...acc, augmentedFile];
    }, []);
  }

  async getFileContent(sha: string, index: number, total: number): Promise<string> {
    this.progressTick();

    const { data: { content } } = (await this.addToQueue(`git.getBlob (${index + 1}/${total}) ${sha}`, this.throttle, () => (
      this.octoKit?.git.getBlob({
        owner: this.owner,
        repo: this.repo,
        file_sha: sha,
      }) as Promise<unknown>
    )) as RestEndpointMethodTypes['git']['getBlob']['response']);

    return atob(content);
  }

  async getCurrentCommit(): Promise<GitCurrentCommit> {
    this.progressTick();

    const { data: { object: { sha: commitSha } } } = (await this.addToQueue(`git.getRef heads/${this.branch}`, this.throttle, () => (
      this.octoKit?.git.getRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${this.branch}`,
      }) as Promise<unknown>
    )) as RestEndpointMethodTypes['git']['getRef']['response']);

    const { data: commitData } = (await this.addToQueue(`git.getCommit ${commitSha}`, this.throttle, () => (
      this.octoKit?.git.getCommit({
        owner: this.owner,
        repo: this.repo,
        commit_sha: commitSha,
      }) as Promise<unknown>
    )) as RestEndpointMethodTypes['git']['getCommit']['response']);

    return {
      commitSha,
      treeSha: commitData.tree.sha,
    };
  }

  async createBlobForFile({ destination, blob }: UploadFile, index: number, total: number): Promise<GitBlobFile> {
    this.progressTick();

    const content = await readFileAs(blob, ReadAs.DATA_URL);

    const rawContentStart = content.indexOf(';base64,') + 8;
    const rawContent = content.slice(rawContentStart);

    const { data: blobData } = (await this.addToQueue(`git.createBlob (${index + 1}/${total}) ${destination}`, this.throttle, () => (
      this.octoKit?.git.createBlob({
        owner: this.owner,
        repo: this.repo,
        content: rawContent,
        encoding: 'base64',
      }) as Promise<unknown>
    )) as RestEndpointMethodTypes['git']['createBlob']['response']);

    return {
      filename: destination,
      blobData,
    };
  }

  async createNewTree(files: GitBlobFile[], del: RepoFile[], parentTreeSha: string): Promise<string> {
    this.progressTick();

    const newFiles = files.map(({ filename, blobData: { sha } }): GitCreateTree => ({
      path: filename,
      mode: '100644',
      type: 'blob',
      sha,
    }));

    const deleteFiles = del.map(({ path }): GitCreateTree => ({
      path,
      mode: '100644',
      sha: null,
    }));

    const { data } = (await this.addToQueue(`git.createTree ${parentTreeSha}`, this.throttle, () => (
      this.octoKit?.git.createTree({
        owner: this.owner,
        repo: this.repo,
        tree: [...newFiles, ...deleteFiles],
        base_tree: parentTreeSha,
      }) as Promise<unknown>
    )) as RestEndpointMethodTypes['git']['createTree']['response']);

    return data.sha;
  }

  async createNewCommit(message: string, currentTreeSha: string, currentCommitSha: string): Promise<string> {
    this.progressTick();

    const { data } = (await this.addToQueue(`git.createCommit ${message}`, this.throttle, () => (
      this.octoKit?.git.createCommit({
        owner: this.owner,
        repo: this.repo,
        message,
        tree: currentTreeSha,
        parents: [currentCommitSha],
      }) as Promise<unknown>
    )) as RestEndpointMethodTypes['git']['createCommit']['response']);

    return data.sha;
  }

  async setBranchToCommit(commitSha: string): Promise<void> {
    this.progressTick();

    await this.addToQueue(`git.updateRef ${commitSha}`, this.throttle, () => (
      this.octoKit?.git.updateRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${this.branch}`,
        sha: commitSha,
      }) as Promise<unknown>
    )) as RestEndpointMethodTypes['git']['updateRef']['response'];
  }

  async uploadToRepo({ upload, del }: RepoTasks): Promise<void> {
    if (!this.octoKit) {
      throw new Error('OctoClient not configured');
    }

    const commitMessage = `Sync. ${dateFormatLocale(dayjs(), this.getPreferredLocale())}`;

    const uploadLength = upload.length;

    const { treeSha, commitSha } = await this.getCurrentCommit();

    const filesData = await Promise.all(upload.map((file, index) => (
      this.createBlobForFile(file, index, uploadLength)
    )));

    const newTreeSha = await this.createNewTree(filesData, del, treeSha);

    const newCommitSha = await this.createNewCommit(commitMessage, newTreeSha, commitSha);

    await this.setBranchToCommit(newCommitSha);
  }

  async updateRemoteStore({ upload, del }: RepoTasks): Promise<GitUploadResult> {
    try {
      if (this.busy) {
        throw new Error('currently busy');
      }

      if (!upload.length && !del.length) {
        return {};
      }

      this.progressStart(upload.length);

      this.busy = true;
      await this.uploadToRepo({ upload, del });
      this.busy = false;

      this.progressTick(true);

      return {
        uploaded: upload.map(({ destination }) => destination),
        deleted: del.map(({ path }) => path),
        repo: `https://github.com/${this.owner}/${this.repo}/tree/${this.branch}`,
      };
    } catch (error) {
      this.busy = false;
      this.emit('error', error);
      throw error;
    }
  }
}

export default OctoClient;
