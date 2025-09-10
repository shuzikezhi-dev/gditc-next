// 结构化数据生成工具

export interface OrganizationData {
  name: string;
  description: string;
  url: string;
  logo: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
    postalCode: string;
  };
  contactPoint?: {
    telephone?: string;
    email: string;
  };
  sameAs?: string[];
}

export interface ArticleData {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: OrganizationData;
  url: string;
}

export interface WebPageData {
  name: string;
  description: string;
  url: string;
  isPartOf: {
    name: string;
    url: string;
  };
  datePublished?: string;
  dateModified?: string;
  breadcrumb?: {
    name: string;
    url: string;
  }[];
}

// 生成组织结构化数据
export function generateOrganizationSchema(data: OrganizationData) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "logo": {
      "@type": "ImageObject",
      "url": data.logo
    },
    ...(data.address && {
      "address": {
        "@type": "PostalAddress",
        "streetAddress": data.address.streetAddress,
        "addressLocality": data.address.addressLocality,
        "addressCountry": data.address.addressCountry,
        "postalCode": data.address.postalCode
      }
    }),
    ...(data.contactPoint && {
      "contactPoint": {
        "@type": "ContactPoint",
        ...(data.contactPoint.telephone && { "telephone": data.contactPoint.telephone }),
        "email": data.contactPoint.email
      }
    }),
    ...(data.sameAs && { "sameAs": data.sameAs })
  };
}

// 生成文章结构化数据
export function generateArticleSchema(data: ArticleData) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.headline,
    "description": data.description,
    ...(data.image && {
      "image": {
        "@type": "ImageObject",
        "url": data.image
      }
    }),
    "datePublished": data.datePublished,
    "dateModified": data.dateModified,
    "author": {
      "@type": "Person",
      "name": data.author.name,
      ...(data.author.url && { "url": data.author.url })
    },
    "publisher": generateOrganizationSchema(data.publisher),
    "url": data.url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": data.url
    }
  };
}

// 生成网页结构化数据
export function generateWebPageSchema(data: WebPageData) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "isPartOf": {
      "@type": "WebSite",
      "name": data.isPartOf.name,
      "url": data.isPartOf.url
    },
    ...(data.datePublished && { "datePublished": data.datePublished }),
    ...(data.dateModified && { "dateModified": data.dateModified }),
    ...(data.breadcrumb && {
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": data.breadcrumb.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      }
    })
  };
}

// 生成面包屑导航
export function generateBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// 生成 FAQ 结构化数据
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// 生成事件结构化数据
export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
    address?: string;
  };
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "description": event.description,
    "startDate": event.startDate,
    ...(event.endDate && { "endDate": event.endDate }),
    ...(event.location && {
      "location": {
        "@type": "Place",
        "name": event.location.name,
        ...(event.location.address && { "address": event.location.address })
      }
    }),
    "url": event.url,
    ...(event.image && {
      "image": {
        "@type": "ImageObject",
        "url": event.image
      }
    })
  };
}

// DITC 默认组织数据
export const DITC_ORGANIZATION: OrganizationData = {
  name: "Digital Infrastructure Technical Council",
  description: "Global Digital Infrastructure Technology Exchange. Leading international standards for digital infrastructure.",
  url: "https://gditc.org",
  logo: "https://gditc.org/logo_ditc.png",
  address: {
    streetAddress: "60 Paya Lebar Road, #12-03, Paya Lebar Square",
    addressLocality: "Singapore",
    addressCountry: "SG",
    postalCode: "409051"
  },
  contactPoint: {
    email: "info@ditc.global"
  },
  sameAs: [
    "https://www.linkedin.com/company/ditc-global",
    "https://twitter.com/DITC_Global"
  ]
};
