import React from "react";
import { OptimizedImage } from "@/components/OptimizedImage";

interface TimelineBlockProps {
  bg: string;
  desktopBanner: string;
  mobileBanner: string;
  items: {
    title: string;
    content: string;
    time: string;
  }[];
}

const TimelineBlock: React.FC<TimelineBlockProps> = ({
  desktopBanner,
  mobileBanner,
  items,
}) => {
  return (
    <div className="timeline-block mb-8 bg-gray-50 rounded-lg overflow-hidden">
      <div className="relative h-48 md:h-64">
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopBanner} />
          <OptimizedImage
            src={mobileBanner}
            alt="Timeline banner"
            fill
            className="object-cover"
          />
        </picture>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 relative before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-gray-200"
            >
              <div className="relative z-10 w-5 h-5 rounded-full bg-primary mt-1 flex-shrink-0" />
              <div>
                <time className="text-sm text-gray-500">{item.time}</time>
                <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineBlock;
