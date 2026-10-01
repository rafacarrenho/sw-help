import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sw-help.rafabcarrenho.workers.dev',
  output: 'static',
  build: {
    format: 'file',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', { path: 'pt', codes: ['pt', 'pt-BR'] }],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
