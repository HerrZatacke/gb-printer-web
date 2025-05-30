export const inflate = async (data: string): Promise<string> => {
  const { default: pako } = await import(/* webpackChunkName: "pko" */ 'pako');

  // ToDo: @types/pako wrong?
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const inflated = pako.inflate(data, { to: 'string' });

  return inflated;
};

export const deflate = async (data: string): Promise<string> => {
  const { default: pako } = await import(/* webpackChunkName: "pko" */ 'pako');

  // ToDo: @types/pako wrong?
  const compressed = pako.deflate(data, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    to: 'string',
    strategy: 1,
    level: 8,
  }) as unknown as string;

  return compressed;
};

