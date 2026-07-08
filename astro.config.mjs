import {defineConfig} from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://docs.revenza.in',
  publicDir: 'static',
  integrations: [react(), mdx()],
  server: {
    host: true,
  },
});
