export class BufferWriter {
  private buffer: ArrayBuffer;
  private view: DataView<ArrayBuffer>;
  private offset: number = 0;

  constructor(size: number) {
    this.buffer = new ArrayBuffer(size);
    this.view = new DataView(this.buffer);
  }

  setUint8(value: number) {
    this.view.setUint8(this.offset, value);
    this.offset += 1;
  }

  setUint16(value: number, littleEndian = true) {
    this.view.setUint16(this.offset, value, littleEndian);
    this.offset += 2;
  }

  setUint32(value: number, littleEndian = true) {
    this.view.setUint32(this.offset, value, littleEndian);
    this.offset += 4;
  }

  setInt8(value: number) {
    this.view.setInt8(this.offset, value);
    this.offset += 1;
  }

  setInt16(value: number, littleEndian = true) {
    this.view.setInt16(this.offset, value, littleEndian);
    this.offset += 2;
  }

  setInt32(value: number, littleEndian = true) {
    this.view.setInt32(this.offset, value, littleEndian);
    this.offset += 4;
  }

  getBuffer(): ArrayBuffer {
    return this.buffer;
  }
}
