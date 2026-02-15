/* eslint-disable @typescript-eslint/no-explicit-any */
type GapiClient = typeof gapi.client;

export const patchGapiClient = (gapiClient: GapiClient, increaseReads: (() => Promise<void>), increaseWrites: (() => Promise<void>)): GapiClient => {
  const asyncWrapper = async <T extends (...args: any[]) => Promise<any>>(fn: T, request: unknown, readWrite: 'read' | 'write') => {
    switch (readWrite) {
      case 'read':
        await increaseReads();
        break;
      case 'write':
        await increaseWrites();
        break;
      default:
        break;
    }

    return fn(request);
  };

  const patched = {
    ...gapiClient,
    sheets: {
      spreadsheets: {
        get: (request: unknown) => asyncWrapper(gapiClient.sheets.spreadsheets.get, request, 'read'),
        batchUpdate: (request: unknown) => asyncWrapper(gapiClient.sheets.spreadsheets.batchUpdate, request, 'write'),
        developerMetadata: {
          search: (request: unknown) => asyncWrapper(gapiClient.sheets.spreadsheets.developerMetadata.search, request, 'read'),
        },
        values: {
          get: (request: unknown) => asyncWrapper(gapiClient.sheets.spreadsheets.values.get, request, 'read'),
          update: (request: unknown) => asyncWrapper(gapiClient.sheets.spreadsheets.values.update, request, 'write'),
        },
      },
    },
  };

  return patched as unknown as GapiClient;
};
