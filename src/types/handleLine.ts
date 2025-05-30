export enum HandleLine {
  NEW_LINES = 'NEW_LINES',
  IMAGE_COMPLETE = 'IMAGE_COMPLETE',
  PARSE_ERROR = 'PARSE_ERROR',
}

export interface ImportLineBase {
  type: HandleLine,
}

export interface ImportLineNewLines extends ImportLineBase {
  type: HandleLine.NEW_LINES,
  payload: string[],
}

export interface ImportLineImageComplete extends ImportLineBase {
  type: HandleLine.IMAGE_COMPLETE,
}

export interface ImportLineError extends ImportLineBase {
  type: HandleLine.PARSE_ERROR,
  payload: string,
}

export type ImportLine = ImportLineNewLines | ImportLineImageComplete | ImportLineError;
