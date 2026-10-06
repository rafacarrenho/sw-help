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
      PUBLIC_ADSTERRA_BANNER_KEY: envField.string({
        context: 'client',
        access: 'public',
        default: '',
      }),
      PUBLIC_ADSTERRA_BANNER_SCRIPT_URL: envField.string({
        context: 'client',
        access: 'public',
        default: '',
      }),
      PUBLIC_ADSTERRA_CONTEXTUAL_KEY: envField.string({
        context: 'client',
        access: 'public',
        default: '',
      }),
      PUBLIC_ADSTERRA_CONTEXTUAL_SCRIPT_URL: envField.string({
        context: 'client',
        access: 'public',
        default: '',
      }),
      PUBLIC_ADSTERRA_BANNER_WIDTH: envField.string({
        context: 'client',
        access: 'public',
        default: '728',
      }),
      PUBLIC_ADSTERRA_BANNER_HEIGHT: envField.string({
        context: 'client',
        access: 'public',
        default: '90',
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
