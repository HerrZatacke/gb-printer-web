import { PortDeviceType, PortType } from '@/consts/ports';
import { CommonPort } from '@/tools/comms/CommonPort';
import { BaseCommsDevice } from '@/tools/comms/DeviceAPIs/BaseCommsDevice';
import { randomId } from '@/tools/randomId';

export const DEFAULT_BAUD_RATE = 1_000_000;
export const FAST_BAUD_RATE = 1_700_000;
const BLOCK_SIZE = 64;
const IMAGE_SIZE = 0x0E00;
const IMAGE_BLOCK_COUNT = IMAGE_SIZE / BLOCK_SIZE;
const METADATA_SIZE = 0x0A00;
const METADATA_BLOCK_COUNT = METADATA_SIZE / BLOCK_SIZE;
const LAST_ADDRESS_SCAN_BYTES = 2500;
const BLOCK_TIMEOUT_MS = 500;
const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY_MS = 200;
const DEFAULT_METADATA_RETRY_COUNT = 2;
const COMMAND_ACK_TIMEOUT_MS = 500;
const ACK_SUCCESS = 0x31;

export const MAX_SUPPORTED_IMAGE_INDEX = 18720;

const LAST_ADDRESS_MAP = new Map<number, number>([
  [0x00, 8],
  [0x01, 7],
  [0x03, 6],
  [0x07, 5],
  [0x0f, 4],
  [0x1f, 3],
  [0x3f, 2],
  [0x7f, 1],
]);

export interface PicNRecReadImageOptions {
  retries?: number;
  retryDelayMs?: number;
}

type ReleaseLockFn = () => void;

export class PicNRecCommsDevice implements BaseCommsDevice {
  private readonly device: CommonPort;
  private readonly encoder = new TextEncoder();
  private operationLock: Promise<void> = Promise.resolve();
  public readonly id: string;
  public readonly description: string;
  public readonly portDeviceType = PortDeviceType.PICNREC;
  public readonly portType: PortType;

  constructor(device: CommonPort) {
    this.device = device;
    this.portType = device.portType;
    this.id = randomId();
    this.description = `PicNRec - ${device.getDescription()}`;
  }

  public static decodeLastImageNumber(metadata: Uint8Array): number {
    let lastAddress = 0;

    for (let index = 0; index < Math.min(metadata.length, LAST_ADDRESS_SCAN_BYTES); index += 1) {
      lastAddress += LAST_ADDRESS_MAP.get(metadata[index]) ?? 0;
    }

    return lastAddress;
  }

  public static async probe(device: CommonPort): Promise<number | null> {
    const candidate = new PicNRecCommsDevice(device);

    try {
      return await candidate.readLastImageNumber();
    } catch {
      return null;
    } finally {
      try {
        await candidate.ensureIdle();
      } catch {
      }
    }
  }

  public async readLastImageNumber(): Promise<number> {
    return this.runExclusive(async () => {
      const metadata = await this.readMetadataCore();
      return PicNRecCommsDevice.decodeLastImageNumber(metadata);
    });
  }

  public async readMetadata(): Promise<Uint8Array> {
    return this.runExclusive(() => this.readMetadataCore());
  }

  public async readImage(imageNumber: number, options: PicNRecReadImageOptions = {}): Promise<Uint8Array> {
    return this.runExclusive(() => this.readImageCore(imageNumber, options));
  }

  public async clearLastImageLocation(): Promise<void> {
    return this.runExclusive(() => this.clearLastImageLocationCore());
  }

  private async runExclusive<T>(operation: () => Promise<T>): Promise<T> {
    const pendingOperation = this.operationLock.catch(() => undefined);
    let releaseLock: ReleaseLockFn = () => undefined;

    this.operationLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });

    await pendingOperation;

    try {
      return await operation();
    } finally {
      releaseLock();
    }
  }

  private async readMetadataCore(): Promise<Uint8Array> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= DEFAULT_METADATA_RETRY_COUNT; attempt += 1) {
      try {
        await this.prepareForTransfer();
        await this.setNumber('A', 0);
        await this.setMode('R');

        const metadata = await this.readBlockSequence(METADATA_BLOCK_COUNT);
        await this.ensureIdle();
        return metadata;
      } catch (error) {
        lastError = error as Error;
        await this.ensureIdle();

        if (attempt < DEFAULT_METADATA_RETRY_COUNT) {
          await this.delay(DEFAULT_RETRY_DELAY_MS);
        }
      }
    }

    throw new Error(`Metadata read failed after ${DEFAULT_METADATA_RETRY_COUNT} attempts.${lastError ? ` ${lastError.message}` : ''}`);
  }

  private async readImageCore(imageNumber: number, options: PicNRecReadImageOptions = {}): Promise<Uint8Array> {
    const retries = options.retries ?? DEFAULT_RETRY_COUNT;
    const retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;

    for (let attempt = 1; attempt <= retries; attempt += 1) {
      try {
        await this.prepareForTransfer();
        await this.setNumber('A', imageNumber);
        await this.setMode('R');
        const image = await this.readBlockSequence(IMAGE_BLOCK_COUNT);
        await this.ensureIdle();
        return image;
      } catch (error) {
        await this.ensureIdle();

        if (attempt === retries) {
          throw new Error(`Image read failed after ${retries} attempts: ${(error as Error).message}`);
        }

        await this.delay(retryDelayMs);
      }
    }

    throw new Error('Image read failed for an unknown reason.');
  }

  private async clearLastImageLocationCore(): Promise<void> {
    await this.prepareForTransfer();
    await this.setMode('k');

    const acknowledgement = await this.device.read({ length: 1, timeout: COMMAND_ACK_TIMEOUT_MS });

    if (acknowledgement.length !== 1 || acknowledgement[0] !== ACK_SUCCESS) {
      throw new Error('PicNRec did not acknowledge the clear-last-image command.');
    }

    await this.flushInput();
  }

  private async prepareForTransfer(): Promise<void> {
    await this.ensureIdle();
    await this.flushInput();
  }

  private async flushInput(silenceMs = 40, maxDrainMs = 300): Promise<void> {
    const deadline = Date.now() + maxDrainMs;

    while (Date.now() < deadline) {
      const buffered = await this.device.read({ timeout: silenceMs });
      if (!buffered.byteLength) {
        return;
      }
    }
  }

  private async ensureIdle(): Promise<void> {
    await this.safeStop();
    await this.flushInput();
  }

  private async setMode(command: string): Promise<void> {
    await this.device.send(this.encoder.encode(command), []);
  }

  private async setNumber(command: string, value: number): Promise<void> {
    const hex = Math.max(0, Number(value)).toString(16);
    await this.device.send(this.encoder.encode(`${command}${hex}\0`), []);
  }

  private async readBlockSequence(blockCount: number): Promise<Uint8Array> {
    const output = new Uint8Array(blockCount * BLOCK_SIZE);
    let offset = 0;

    for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
      const block = await this.device.read({ length: BLOCK_SIZE, timeout: BLOCK_TIMEOUT_MS });

      if (block.length !== BLOCK_SIZE) {
        throw new Error(`Timed out waiting for ${BLOCK_SIZE} bytes; received ${block.length}.`);
      }

      output.set(block, offset);
      offset += block.length;

      if (blockIndex < blockCount - 1) {
        await this.setMode('1');
      }
    }

    return output;
  }

  private async safeStop(): Promise<void> {
    try {
      await this.setMode('0');
    } catch {
    }
  }

  private async delay(ms: number): Promise<void> {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }
}
