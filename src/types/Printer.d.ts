export interface BlobResponse {
  blob: Blob // Sent by fetchImages,
  contentType: string // Sent by fetchImages,
  status: number // Sent by fetchImages,
  ok: boolean // Sent by fetchImages,
  meta: { // Sent by fetchImages,
    headers: object,
  },
}

export interface PrinterInfo {
  fs: { // sent by checkPrinter
    total: number,
    used: number,
    available: number,
    maximages: number,
    dumpcount: number,
  },
  dumps: string[], // sent by checkPrinter
}

export interface FromPrinterEvent {
  lines: string[], // sent by testFile (Deprecated?)
  progress: number,
  blobsdone: BlobResponse[],
  commands: string[],
  printerData: PrinterInfo,
  height: number,
  blob: Blob // fallback for printers with web-app version < 1.15.5 to display some "fake" progress (Deprecated)
}

export interface NamedFile extends BlobResponse {
  blobName: string,
}

export interface PrinterParams {
  dumps: string[],
}

export interface ToPrinterEvent {
  command: string,
  params?: PrinterParams,
}

export type RemotePrinterEvent = Partial<{
  fromRemotePrinter: Partial<FromPrinterEvent>,
  toRemotePrinter: ToPrinterEvent,
}>
