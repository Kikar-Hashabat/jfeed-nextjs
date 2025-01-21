export function generateHomeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        url: process.env.NEXT_PUBLIC_WEBSITE_URL,
        logo: "/logo/jfeed-logo_512x512.png",
      },
      {
        "@type": "WebPage",
        name: "JFeed - Israel News",
        url: process.env.NEXT_PUBLIC_WEBSITE_URL,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@type": "WebPage",
                "@id": process.env.NEXT_PUBLIC_WEBSITE_URL,
                name: "Home",
              },
            },
          ],
        },
      },
    ],
  };
}
