import { Metadata } from "next";

export async function generateArchiveMetadata(
  params: Promise<{
    year?: string;
    month?: string;
    page?: string;
  }>
): Promise<Metadata> {
  const resolvedParams = await params;

  const baseTitle = "News Archive - Browse All Articles | JFeed";
  const baseDescription =
    "Access JFeed's comprehensive news archive. Browse articles by date, category, " +
    "and topic. Stay informed with our extensive collection of news coverage, features, " +
    "and analysis.";

  if (resolvedParams.year && resolvedParams.month) {
    const date = new Date(
      parseInt(resolvedParams.year),
      parseInt(resolvedParams.month) - 1
    );

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);

    const pageNumber = resolvedParams.page
      ? ` - Page ${resolvedParams.page}`
      : "";

    const title = `${formattedDate} News Archive${pageNumber} | JFeed`;
    const description =
      `Browse JFeed's news archive for ${formattedDate}. ` +
      `Find all articles, news coverage, and features from this period. ` +
      `Access comprehensive reporting and analysis from our journalists.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "JFeed",
      },
      alternates: {
        canonical:
          resolvedParams.page === "1" || !resolvedParams.page
            ? `/archive?year=${resolvedParams.year}&month=${resolvedParams.month}`
            : `/archive?year=${resolvedParams.year}&month=${resolvedParams.month}&page=${resolvedParams.page}`,
      },
    };
  }

  return {
    title: baseTitle,
    description: baseDescription,
    openGraph: {
      title: baseTitle,
      description: baseDescription,
      type: "website",
      siteName: "JFeed",
    },
    alternates: {
      canonical: "/archive",
    },
  };
}
