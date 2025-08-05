import { crx } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
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
    crx({ manifest }),
    zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
  ],
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
