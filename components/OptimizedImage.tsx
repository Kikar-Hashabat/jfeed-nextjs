import Image from "next/image";

// Cloudflare image transformation options interface
export interface ICloudflareImageTransformOptions {
  width?: CloudflareImageWidth | number;
  height?: number;
  dpr?: number;
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
  gravity?: "auto" | "side";
  quality?: number;
  format?: "auto" | "jpeg" | "webp" | "avif" | "json";
  anim?: "false";
  sharpen?: number;
  blur?: number;
}

// Cloudflare width enum
export enum CloudflareImageWidth {
  "W1200" = 1200,
  "W900" = 900,
  "W500" = 500,
  "W400" = 400,
  "W300" = 300,
  "W200" = 200,
  "W64" = 64,
}

// Cloudflare origins
const cloudflareOrigins: Array<string> = [
  "https://images.kikar.co.il",
  "https://videos.kikar.co.il",
  "https://s1.kikar.co.il",
  "https://s3.kikar.co.il",
  "https://kikar.co.il",
  "https://www.kikar.co.il",
  "https://kids.kikar.co.il",
  "https://legacy.kikar.co.il",
  "https://www.jfeed.com",
  "https://en.srugim.co.il",
  "https://images-en.srugim.co.il",
  "https://videos-en.srugim.co.il",
  "https://images.jfeed.com",
  "https://videos.jfeed.com",
];

// Default transform options
const transformOptionsDefault: ICloudflareImageTransformOptions = {
  format: "jpeg",
  fit: "contain",
  quality: 85,
  // width will be added dynamically
};

// Interface for the enhanced OptimizedImage component
// Preset sizes for common image dimensions
export interface ImagePresetSizes {
  width: number;
  height: number;
}

export const ImageSizes = {
  thumbnail: { width: 100, height: 100 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 900, height: 600 },
  hero: { width: 1200, height: 800 },
  square: {
    small: { width: 200, height: 200 },
    medium: { width: 400, height: 400 },
    large: { width: 600, height: 600 },
  },
} as const;

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  isHero?: boolean;
  cloudflareOptions?: ICloudflareImageTransformOptions;
  width?: number | CloudflareImageWidth;
  height?: number;
  preset?:
    | keyof typeof ImageSizes
    | "square.small"
    | "square.medium"
    | "square.large";
}

// Helper function to process Cloudflare image URL
function getCloudflareFormatImageUrl(
  src: string,
  options: ICloudflareImageTransformOptions = {}
): string {
  if (src.indexOf("/cdn-cgi/image/") !== -1) return src;

  const originIndex = cloudflareOrigins.findIndex(
    (origin) => src && src.indexOf(origin) === 0
  );

  if (originIndex === -1) return src;

  const _options = {
    ...transformOptionsDefault,
    ...options,
  };

  const originalPath = src.slice(cloudflareOrigins[originIndex].length);
  const today = new Date();
  const forceNewImage =
    typeof process !== "undefined" &&
    process?.env?.NEXT_PUBLIC_APP_TYPE === "admin" &&
    originalPath
      .split("/")
      .slice(1, 4)
      .join("/") ===
      `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

  const transformString = Object.entries({
    format: _options.format,
    fit: _options.fit,
    width: _options.width,
    quality: _options.quality,
    ..._options,
  })
    .filter(([_, value]) => value !== undefined) // eslint-disable-line @typescript-eslint/no-unused-vars
    .map(([key, value]) => `${key}=${value}`)
    .join(",");

  const newPath = `${
    cloudflareOrigins[originIndex]
  }/cdn-cgi/image/${transformString}${
    originalPath[0] !== "/" ? "/" : ""
  }${originalPath}`;

  if (!forceNewImage) return newPath;

  const timestamp = Math.floor(Date.now() / (3 * 60 * 60 * 1000));
  const separator = originalPath.includes("?")
    ? originalPath.endsWith("?")
      ? ""
      : "&"
    : "?";

  return `${newPath}${separator}admin${timestamp}`;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fill = false,
  className = "",
  sizes = "100vw",
  priority = false,
  isHero = false,
  cloudflareOptions,
  width,
  height,
  preset,
}) => {
  // Handle preset sizes
  let finalWidth = width;
  let finalHeight = height;

  if (preset) {
    if (preset.includes(".")) {
      // Handle nested square presets
      const [category, size] = preset.split(".");
      if (
        category === "square" &&
        ImageSizes.square[size as keyof typeof ImageSizes.square]
      ) {
        const presetSize =
          ImageSizes.square[size as keyof typeof ImageSizes.square];
        finalWidth = presetSize.width;
        finalHeight = presetSize.height;
      }
    } else {
      // Handle regular presets
      const presetSize = ImageSizes[
        preset as keyof typeof ImageSizes
      ] as ImagePresetSizes;
      if (presetSize) {
        finalWidth = presetSize.width;
        finalHeight = presetSize.height;
      }
    }
  }
  const shouldPrioritize = priority || isHero;
  const processedSrc = getCloudflareFormatImageUrl(src, {
    ...cloudflareOptions,
    ...(finalWidth && { width: finalWidth }),
    ...(finalHeight && { height: finalHeight }),
  });

  return (
    <Image
      src={processedSrc || ""}
      alt={alt}
      title={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={shouldPrioritize}
      quality={85}
      loading={shouldPrioritize ? "eager" : "lazy"}
      {...(!fill && width && height && { width, height })}
    />
  );
};
