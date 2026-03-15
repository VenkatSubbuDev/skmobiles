import { useEffect } from 'react';

const DEFAULT_TITLE = 'SK Mobiles';
const DEFAULT_DESCRIPTION = 'Your mobile phone destination';

interface MetaConfig {
  title?: string;
  description?: string;
  schemaData?: any;
}

export function usePageMeta({ title, description, schemaData }: MetaConfig = {}) {
  const pageTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;

  useEffect(() => {
    // Update document title
    document.title = pageTitle;

    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', metaDescription);

    // Update OG title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', pageTitle);
    }

    // Update OG description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', metaDescription);
    }

    // Handle JSON-LD Schema
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (schemaData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaData);
    } else if (scriptTag) {
      // Remove it if there's no schema data for this page
      scriptTag.remove();
    }
  }, [pageTitle, metaDescription, schemaData]);
}

export default usePageMeta;
