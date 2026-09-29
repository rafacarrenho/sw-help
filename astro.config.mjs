import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://sw-help.rafabcarrenho.workers.dev',
  output: 'server',
  adapter: cloudflare(),
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', { path: 'pt', codes: ['pt', 'pt-BR'] }],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
