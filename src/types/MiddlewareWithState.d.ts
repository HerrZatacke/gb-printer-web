import type { Middleware } from 'redux';
import type { State } from '../javascript/app/store/State';

// eslint-disable-next-line @typescript-eslint/ban-types
export type MiddlewareWithState = Middleware<{}, State>;
