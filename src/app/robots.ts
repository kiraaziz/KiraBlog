export default function robots(): any {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    }
  }