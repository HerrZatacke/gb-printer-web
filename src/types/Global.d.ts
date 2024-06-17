import type { TypedStore } from '../javascript/app/store/State';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: <R>(a: R) => R,
    store: TypedStore,
  }
}

export {};
