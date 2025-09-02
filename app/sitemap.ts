import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://www.tapmesaveme.com/',
            lastModified: new Date(),
            priority: 1.0,
        },
        {
            url: 'https://www.tapmesaveme.com/activate',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: 'https://www.tapmesaveme.com/faq',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: 'https://www.tapmesaveme.com/contact',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: 'https://www.tapmesaveme.com/affiliate',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: 'https://www.tapmesaveme.com/privacy',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: 'https://www.tapmesaveme.com/terms',
            lastModified: new Date(),
            priority: 0.8,
        },
    ]
}
