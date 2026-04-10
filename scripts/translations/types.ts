export interface POEResponseStatus {
  status: string;
  code: string;
  message: string;
}

export interface POEResponse<T> {
  response: POEResponseStatus;
  result: T;
}

export interface POELanguage {
  name: string;
  code: string;
  translations: number;
  percentage: number;
  updated: string;
}

export interface POELanguages {
  languages: POELanguage[];
}

export interface POEExport {
  url: string;
}
