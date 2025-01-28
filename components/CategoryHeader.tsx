import Image from "next/image";
import Link from "next/link";

export interface NewsHeaderProps {
  title: string;
  seeMoreText: string;
  iconSrc: string;
  color: string;
}

export const CategoryHeader: React.FC<NewsHeaderProps> = ({
  title,
  seeMoreText,
  iconSrc,
  color,
}) => {
  return (
    <div className="flex overflow-hidden flex-wrap gap-10 justify-between items-start pr-8 pb-2.5 uppercase border-b border-neutral-200 max-md:pr-5">
      <div
        className={`flex-1 shrink gap-2.5 self-stretch pl-4 text-base font-bold text-${color} whitespace-nowrap border-${color} border-l-[6px] w-[81px]`}
      >
        {title}
      </div>
      <div className="flex overflow-hidden gap-1.5 justify-center items-center pl-4 text-base font-medium leading-none border-l border-zinc-300 ">
        <Link
          href="/news"
          className={`flex items-center hover:text-${color} transition-colors`}
          aria-label="See more most talked articles"
        >
          <div className="self-stretch my-auto">{seeMoreText}</div>
          <Image src={iconSrc} alt="Icon" width={20} height={20} />
        </Link>
      </div>
    </div>
  );
};
