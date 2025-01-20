import Link from "next/link";

type TitleProps = {
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  link?: string;
  title: string;
  className?: string;
  id?: string;
};

export default function Title({
  tag: Tag = "h1",
  link = "",
  title,
  className,
  id = "title",
}: TitleProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 bg-primary rounded" aria-hidden="true"></div>
      <Tag id={id} className={className}>
        {link ? <Link href={`/${link}`}>{title}</Link> : title}
      </Tag>
    </div>
  );
}
