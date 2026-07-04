import { type PrinterFunction } from '@/consts/printerFunction';

export interface BlobResponse {
  ok: boolean;
  blob: Blob;
  contentType?: string;
  status?: number;
  meta?: {
    headers: Record<string, string>;
  };
}

export interface PrinterInfo {
  fs: {
    total: number;
    used: number;
    available: number;
    maximages: number;
    dumpcount: number;
  };
  dumps: string[];
  message?: string;
}

export interface CheckPrinterStatus {
  printerData: PrinterInfo;
}

export interface PrinterImages {
  blobsdone: BlobResponse[];
}

export type FromPrinterEvent = Partial<CheckPrinterStatus & PrinterImages & {
  progress: number;
  commands: PrinterFunction[];
}>

export interface PrinterParams {
  dumps: string[];
}

export interface ToPrinterEvent {
  command: string;
  params?: PrinterParams;
}

export type RemotePrinterEvent = Partial<{
  fromRemotePrinter: FromPrinterEvent;
  toRemotePrinter: ToPrinterEvent;
}>
