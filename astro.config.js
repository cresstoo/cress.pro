import { defineConfig } from 'astro/config'
import { remarkReadingTime } from './src/plugins/remarkReadingTime'
import { rehypeCodeBlock } from './src/plugins/rehypeCodeBlock'
import { rehypeTableBlock } from './src/plugins/rehypeTableBlock'
import { rehypeCodeHighlight } from './src/plugins/rehypeCodeHighlight'
import { rehypeImage } from './src/plugins/rehypeImage'
import { rehypeLink } from './src/plugins/rehypeLink'
import { rehypeHeading } from './src/plugins/rehypeHeading'
import remarkDirective from 'remark-directive'
import { remarkSpoiler } from './src/plugins/remarkSpoiler'
import { remarkEmbed } from './src/plugins/remarkEmbed'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import { site } from './src/config.json'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import swup from '@swup/astro'

// https://astro.build/config
export default defineConfig({
  site: site.url,
  integrations: [
    tailwind(),
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // 自定义每个页面的配置
      customPages: [
        {
          url: '/works',
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: new Date(),
        },
      ],
    }),
    swup({
      theme: false,
      animationClass: 'swup-transition-',
      containers: ['main'],
    }),
  ],
  markdown: {
    syntaxHighlight: false,
    smartypants: false,
    remarkPlugins: [remarkMath, remarkDirective, remarkEmbed, remarkSpoiler, remarkReadingTime],
    rehypePlugins: [
      rehypeHeadingIds,
      rehypeKatex,
      rehypeLink,
      rehypeImage,
      rehypeHeading,
      rehypeCodeBlock,
      rehypeCodeHighlight,
      rehypeTableBlock,
    ],
    remarkRehype: { footnoteLabel: '参考', footnoteBackLabel: '返回正文' },
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
        // 分块策略
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['framer-motion', 'jotai'],
          },
        },
      },
      // 压缩选项
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    // 开发服务器配置
    server: {
      hmr: {
        overlay: false,
      },
    },
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
    domains: ['s2.loli.net', 'raw.githubusercontent.com'],
    format: ['webp'],
    fallback: 'jpeg',
    quality: 80,
  },
  prefetch: true,
  // 添加性能优化配置
  build: {
    inlineStylesheets: 'auto', // 内联关键 CSS
  },
})
