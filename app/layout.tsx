import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to JFeed - your personalized news feed. Stay updated with the latest news and stories from around the world.",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "es-ES": "/es-ES",
    },
  },
  openGraph: {
    title: "JFeed Home - Your Personalized News Feed",
    description:
      "Welcome to JFeed - your personalized news feed. Stay updated with the latest news and stories from around the world.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${newsreader.variable} antialiased h-full`}>
        <Header />
        <main className="container mt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
