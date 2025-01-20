export function generateHomeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        url: "https://www.jfeed.com",
        logo: "/logo/jfeed-logo_512x512.png",
      },
      {
        "@type": "WebPage",
        name: "JFeed - Israel News",
        url: "https://www.jfeed.com/",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@type": "WebPage",
                "@id": "https://www.jfeed.com/",
                name: "Home",
              },
            },
          ],
        },
      },
    ],
  };
}
