import { Engine, installExtensions } from './core';

// CONSTANTS EXPORT
export const Grid = 100;
export const lg = 61.8;
export const sm = 38.2;
export const auto = 'auto';

if (typeof window !== 'undefined') {
  installExtensions();
}

export { Engine, installExtensions };
export * from './core';