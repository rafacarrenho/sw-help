import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: 'https://www.playerdojo.com',
  output: 'static',
  build: {
    format: 'file',
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_ANALYTICS_ID: envField.string({
        context: 'client',
        access: 'public',
        default: 'G-QTMVTJP8FE',
      }),
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', { path: 'pt', codes: ['pt', 'pt-BR'] }],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
