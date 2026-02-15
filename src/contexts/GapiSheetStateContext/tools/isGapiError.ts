export type GapiRequestError = {
  status: number;
  statusText?: string;
  result: {
    error: {
      code: number;
      message: string;
      status?: string;
      errors?: Array<{
        message: string;
        domain: string;
        reason: string;
      }>;
    };
  };
};

export const isGapiError = (error: unknown): error is GapiRequestError => {
  return typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'result' in error &&
    'error' in (error.result as object);
};
