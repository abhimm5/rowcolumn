import { defineConfig } from 'tsup';

export default defineConfig({
  // ADD src/angular.ts HERE
  entry: ['src/index.ts', 'src/react.tsx', 'src/vue.ts', 'src/angular.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: false, 
  minify: true,
  clean: true,
  
  // ADD ANGULAR PACKAGES HERE
  external: ['react', 'vue', '@angular/core', '@angular/common']
});