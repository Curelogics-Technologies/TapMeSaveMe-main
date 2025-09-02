import { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Add any specific paths you want to disallow here
                // For example:
                // disallow: '/admin/', 
            },
        ],
        sitemap: 'https://tapmesaveme.com/sitemap.xml',
    }
}