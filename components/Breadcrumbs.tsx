import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  url: string;
  isLink: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const breadcrumbs = [{ name: "Home", url: "/", isLink: true }, ...items];

  return (
    <nav className="breadcrumbs">
      <ol className="flex flex-wrap items-center text-lg font-serif">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.isLink ? (
              <>
                <Link href={item.url} className="hover:underline">
                  {item.name}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2">/</span>
                )}
              </>
            ) : (
              <>
                <span className="opacity-80">{item.name}</span>
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2">/</span>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
