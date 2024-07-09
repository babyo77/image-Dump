import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/store/context";
import Popup from "@/components/ui/popup";
export const metadata: Metadata = {
  title: "imageDump",
  description: "Dump all of your images ",
  keywords:
    "Upload profile images, Profile image management, Create and manage profiles, Social media links, Personal branding, Bio link page, Profile customization, Image upload feature, Manage social profiles",
  icons: [{ rel: "icon", url: "/favicon.webp" }],
  openGraph: {
    title: "imageDump ",
    description: "Dump all of your images ",
    url: "https://imageDump.vercel.app",
    type: "website",
    images: [
      {
        url: "https://imageDump.vercel.app/favicon.webp",
        width: 1200,
        height: 630,
        alt: "imageDump OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tanmay11117",
    title: "imageDump ",
    description: "Dump all of your images ",
    images: "https://imageDump.vercel.app/favicon.webp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(GeistSans.className)}>
        <UserProvider>
          {children}
          <Popup />
          <Toaster
            position="top-center"
            richColors
            theme="light"
            visibleToasts={1}
          />
        </UserProvider>
      </body>
    </html>
  );
}
