import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/user/dashboard/'],
    },
    sitemap: 'https://cine-verse-client-rouge.vercel.app/sitemap.xml',
  }
}
