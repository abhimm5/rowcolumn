import { Engine, installExtensions } from './core';

export const lg = 61.8;
export const sm = 38.2;
export const auto = 'auto';

if (typeof window !== 'undefined') {
  installExtensions();
}

export { Engine, installExtensions };
export * from './core';