import { useEffect } from 'react';

const DEFAULT_TITLE = 'SK Mobiles';
const DEFAULT_DESCRIPTION = 'Your mobile phone destination';

interface MetaConfig {
  title?: string;
  description?: string;
}

export function usePageMeta({ title, description }: MetaConfig = {}) {
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
  }, [pageTitle, metaDescription]);
}

export default usePageMeta;
