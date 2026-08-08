// eslint-disable-next-line no-restricted-globals
const NativeDate = Date;

interface SafeDateConstructor {
  new (): Date;
  new (epochMs: number): Date;
  now(): number;
}

const SafeDate = NativeDate as unknown as SafeDateConstructor;

export { SafeDate as Date };
