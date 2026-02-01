import { defineManifest } from '@crxjs/vite-plugin'
import { name, version } from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: name,
  version: version,
  icons: {
    48: 'public/logo.png',
  },
  action: {
    default_icon: {
      48: 'public/logo.png',
    },
    default_popup: 'index.html',
  },
  content_scripts: [{
    js: ['src/content/main.ts'],
    matches: [
      "http://*/*",
      "https://*/*",
      "http://localhost/*",
      "http://127.0.0.1/*",
    ],
  }],
  web_accessible_resources: [
    {
      resources: ["index.html"],
      matches: [
        "http://*/*",
        "https://*/*",
        "http://localhost/*",
        "http://127.0.0.1/*"
      ],
    }
  ],
  permissions: ["storage", "scripting"],
  host_permissions: ["*://dictionary.cambridge.org/*"]
})

