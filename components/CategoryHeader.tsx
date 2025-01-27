import Image from "next/image";
import Link from "next/link";

export interface NewsHeaderProps {
  title: string;
  seeMoreText: string;
  iconSrc: string;
}

export const CategoryHeader: React.FC<NewsHeaderProps> = ({
  title,
  seeMoreText,
  iconSrc,
}) => {
  return (
    <div className="flex overflow-hidden flex-wrap gap-10 justify-between items-start pr-8 pb-2.5 uppercase border-b border-neutral-200 max-w-[889px] max-md:pr-5">
      <div className="flex-1 shrink gap-2.5 self-stretch pl-4 text-base font-bold text-red-700 whitespace-nowrap border-red-700 border-l-[6px] w-[81px]">
        {title}
      </div>
      <div className="flex overflow-hidden gap-1.5 justify-center items-center pl-4 text-base font-medium leading-none border-l border-zinc-300 min-h-[26px] text-zinc-800">
        <Link
          href="/news"
          className="flex items-center hover:text-red-700 transition-colors"
          aria-label="See more most talked articles"
        >
          <div className="self-stretch my-auto">{seeMoreText}</div>
          <Image src={iconSrc} alt="Icon" width={20} height={20} />
        </Link>
      </div>
    </div>
  );
};
