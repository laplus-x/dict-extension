# Dictionary Extension

A Chrome extension for quick Cambridge dictionary lookup, built with React, TypeScript, and Vite.

## Features

- **Cambridge Dictionary Integration**: Fetches definitions, pronunciations, and examples.
- **Autocomplete**: Suggests words as you type.
- **Popup UI**: Displays results in a styled popup.
- **LRU Cache**: Caches dictionary and autocomplete results for performance.
- **Tailwind CSS**: Modern, responsive UI.
- **TypeScript**: Type-safe codebase.
- **Vite Build**: Fast development and optimized production builds.
- **MV3 Manifest**: Chrome Extension Manifest V3 support.
- **Zip Packaging**: Automatically packages builds for release.

## Installation

```sh
git clone https://github.com/laplus-x/dict-extension.git
cd dict-extension
npm install
```

## Usage

### Development

Start the extension in development mode:

```sh
npm run dev
```

### Build

Build and package the extension for release:

```sh
npm run build
```

The packaged extension will be in the `release` directory as a zip file.

## Project Structure

```
vite.config.ts           # Vite configuration with plugins for React, Tailwind, Chrome extension, and zip packaging
manifest.config.js       # Chrome extension manifest (MV3)
package.json             # Project metadata and scripts
src/                     # Source code (React components, hooks, repositories, types, utilities)
public/                  # Static assets
release/                 # Packaged extension output
```

## Configuration

### Vite Plugins (`vite.config.ts`)

- **@vitejs/plugin-react-swc**: Fast React compilation with SWC.
- **@tailwindcss/vite**: Tailwind CSS integration.
- **vite-tsconfig-paths**: TypeScript path alias support.
- **@crxjs/vite-plugin**: Chrome extension build support.
- **vite-plugin-zip-pack**: Zip packaging for release builds.

### Server

- CORS configured to allow `chrome-extension://` origins for development.

### Build

- Removes all `console` and `debugger` statements from production builds.

##