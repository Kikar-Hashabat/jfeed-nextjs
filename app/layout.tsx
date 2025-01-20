import { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@/components/Analytics"; // Import the client component
import "./globals.css";
import { generateLayoutMetadata } from "@/components/seo/metadata";

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jfeed.com"),
  icons: {
    icon: [
      { url: "/logo/jfeed-logo_64.ico", sizes: "64x64" },
      { url: "/logo/jfeed-logo_32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/jfeed-logo_128.png", sizes: "128x128", type: "image/png" },
      { url: "/logo/jfeed-logo_512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo/jfeed-logo_72x72.png", sizes: "72x72", type: "image/png" },
      {
        url: "/logo/jfeed-logo_114x114.png",
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: "/logo/jfeed-logo_144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
    ],
    shortcut: ["/logo/jfeed-logo_64.ico"],
  },
  manifest: "/manifest.json",
  ...generateLayoutMetadata({
    title: "JFeed",
    description:
      "Your Modern News Feed - Stay informed with the latest Jewish news, community updates, and cultural insights.",
    type: "website",
    canonical: "https://www.jfeed.com",
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preconnect"
          href="https://a.jfeed.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://a.jfeed.com" />
        <link
          rel="preload"
          href="/logo/jfeed-new.png"
          as="image"
          imageSizes="140px"
          imageSrcSet="/logo/jfeed-new.png 140w"
        />
      </head>
      <body className="min-h-screen">
        <Analytics />
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-grow pt-20">
          <div className="max-w-6xl mx-auto px-4">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
