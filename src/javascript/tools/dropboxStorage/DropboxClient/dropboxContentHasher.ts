import chunk from 'chunk';
// See https://github.com/dropbox/dropbox-api-content-hasher/blob/master/js-node/dropbox-content-hasher.js

const BLOCK_SIZE = 4 * 1024 * 1024;

export async function hasher(buffer: ArrayBuffer): Promise<string> {
  const blocks = chunk<number>(new Uint8Array(buffer), BLOCK_SIZE);

  const blockHashes = await Promise.all(blocks.map(async (block) => (
    [...new Uint8Array(await crypto.subtle.digest('SHA-256', new Uint8Array(block)))]
  )));

  const overallHashes = new Uint8Array(blockHashes.flat());

  const resultHash = new Uint8Array(await crypto.subtle.digest('SHA-256', overallHashes));

  return [...resultHash].map((bytes: number): string => (bytes.toString(16).padStart(2, '0'))).join('');
}
