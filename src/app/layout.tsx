import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/store/context";
export const metadata: Metadata = {
  title: "1nlink",
  description: "Get a matching profile with images you upload",
  keywords:
    "Upload profile images, Profile image management, Create and manage profiles, Social media links, Personal branding, Bio link page, Profile customization, Image upload feature, Manage social profiles",
  icons: [{ rel: "icon", url: "/favicon.webp" }],
  openGraph: {
    title: "1nlink - Your Ultimate Bio Link Solution",
    description: "Get a matching profile with images u upload",
    url: "https://1nlink.vercel.app",
    type: "website",
    images: [
      {
        url: "https://1nlink.vercel.app/favicon.webp",
        width: 1200,
        height: 630,
        alt: "1nlink OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tanmay11117",
    title: "1nlink - Your Ultimate Bio Link Solution",
    description: "Get a matching profile with images you upload",
    images: "https://1nlink.vercel.app/favicon.webp",
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
