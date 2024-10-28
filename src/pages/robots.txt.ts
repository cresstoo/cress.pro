import type { APIRoute } from 'astro'
import { site } from '@/config.json'

const robotsTxt = `
User-agent: *
Allow: /

Disallow: /api/
Disallow: /_astro/
Disallow: /fonts/

# Sitemap
Sitemap: ${new URL('sitemap-index.xml', site.url).href}
`.trim()

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
