import { BlobResponse } from '../../types/Printer';

const fetchDumpRetry = async (url: string, retries: number): Promise<BlobResponse> => {
  let res: Response;

  try {
    res = await fetch(url);
  } catch (error) {
    if (retries <= 1) {
      throw error;
    }

    return fetchDumpRetry(url, retries - 1);
  }

  const headers: Record<string, string> = {};
  res.headers.forEach((value: string, key: string) => {
    headers[key] = value;
  });

  return (
    res.blob()
      .then((blob: Blob): BlobResponse => ({
        blob,
        contentType: res.headers.get('content-type') || undefined,
        meta: {
          headers,
        },
        status: res.status,
        ok: res.ok,
      }))
  );
};

export default fetchDumpRetry;
