
export interface HandeFileImportOptions {
  fromPrinter: boolean
}

export type HandeFileImportFn = (files: File[], options?: HandeFileImportOptions) => Promise<void>;
