export interface BlobResponse {
  ok: boolean // Sent by fetchImages,
  blob?: Blob // Sent by fetchImages,
  contentType?: string // Sent by fetchImages,
  status?: number // Sent by fetchImages,
  meta?: { // Sent by fetchImages,
    headers: Record<string, string>,
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
  message?: string,
}

// sent by testFile (Deprecated?)
export interface PrinterTestFile {
  lines: string[],
}

export interface CheckPrinterStatus {
  printerData: PrinterInfo,
}

export interface PrinterImages {
  blobsdone: BlobResponse[],
}

export type FromPrinterEvent = Partial<CheckPrinterStatus & PrinterTestFile & PrinterImages & {
  progress: number,
  commands: string[],
  height: number,
  blob: Blob // fallback for printers with web-app version < 1.15.5 to display some "fake" progress (Deprecated)
}>

export interface NamedFile extends BlobResponse {
  blobName: string,
}

export interface PrinterParams {
  dumps: string[],
}

export interface RemotePrinterParams {
  delay?: number,
  [k: string]: string | number | undefined,
}

export interface ToPrinterEvent {
  command: string,
  params?: PrinterParams,
}

export type RemotePrinterEvent = Partial<{
  fromRemotePrinter: FromPrinterEvent,
  toRemotePrinter: ToPrinterEvent,
}>

export interface RemoteEnv {
  targetWindow: Window,
  isIframe: boolean,
  isPopup: boolean,
  isRemote: boolean,
}

export interface PrinterStatusCommand {
  name: 'tear' | 'clearPrinter' | 'checkPrinter',
  fn: () => Promise<CheckPrinterStatus>,
}

export interface PrinterTestfileCommand {
  name: 'testFile',
  fn: () => Promise<PrinterTestFile>,
}

export interface PrinterFetchImagesCommand {
  name: 'fetchImages',
  fn: (targetWindow: Window, params: PrinterParams, remoteParams: RemotePrinterParams) => Promise<PrinterImages>,
}

export type PrinterCommand = PrinterStatusCommand | PrinterTestfileCommand | PrinterFetchImagesCommand;
