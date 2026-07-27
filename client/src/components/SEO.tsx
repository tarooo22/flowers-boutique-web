import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
}

export default function SEO({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  ogUrl,
}: SEOProps) {
  useEffect(() => {
    // Set page title
    document.title = title;

    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Set canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

    // Set Open Graph tags
    const ogTags = [
      { property: 'og:title', content: ogTitle || title },
      { property: 'og:description', content: ogDescription || description },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: ogUrl },
      { property: 'og:image', content: ogImage },
    ];

    ogTags.forEach(({ property, content }) => {
      if (content) {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      }
    });

    return () => {
      // Cleanup is optional - tags will be overwritten on next page
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType, ogUrl]);

  return null;
}
