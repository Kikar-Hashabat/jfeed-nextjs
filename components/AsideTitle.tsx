/*type TitleProps = {
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  link?: string;
  title: string;
  className?: string;
  id?: string;
};*/

export default function AsideTitle({ title }: { title: string }) {
  return (
    <div className="flex overflow-hidden gap-2.5 justify-center items-center pb-2.5 w-full text-base font-bold leading-none text-red-700 uppercase">
      <div className="overflow-hidden gap-2.5 self-stretch pl-4 my-auto border-red-700 border-l-[6px]">
        {title}
      </div>
    </div>
  );
}
