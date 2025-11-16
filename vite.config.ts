/// <reference types="vitest" />
import { crx } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';
import Inspect from "vite-plugin-inspect";
import zip from "vite-plugin-zip-pack";
import tsconfigPaths from 'vite-tsconfig-paths';
import manifest from './manifest.config.js';
import { name, version } from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({ tsDecorators: true }),
    tailwindcss(),
    tsconfigPaths(),
    Inspect({
      open: process.env.NODE_ENV === 'development',
      build: process.env.NODE_ENV === 'development',
      outputDir: '.inspect'
    }),
    analyzer({
      openAnalyzer: process.env.NODE_ENV === 'development',
      analyzerMode: 'static',
      fileName: 'report'
    }),
    crx({ manifest }),
    zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
  ],
  test: {
    globals: true,
    environment: "happy-dom",
    include: ['./src/**/*.{test,spec}.{js,ts}{,x}'],
    setupFiles: ['./vitest.setup.ts']
  },
  server: {
    cors: {
      origin: [
        /chrome-extension:\/\//,
      ],
    },
  },
  esbuild: {
    drop: ['console', 'debugger'], // 移除 console 與 debugger
  },
})
