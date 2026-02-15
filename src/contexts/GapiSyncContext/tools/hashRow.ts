export const hashRow = async(fields: string[]): Promise<string> => {
  const serialized = JSON.stringify(fields);

  const encoder = new TextEncoder();
  const data = encoder.encode(serialized);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);

  let hex = '';
  for (let i = 0; i < 10; i++) { // 10 bytes = 20 hex chars
    hex += hashArray[i].toString(16).padStart(2, '0');
  }

  return hex;
};
