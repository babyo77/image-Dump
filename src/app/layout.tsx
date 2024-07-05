import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/store/context";
export const metadata: Metadata = {
  title: "lnkit",
  description: "A link in bio",
  icons: [{ rel: "icon", url: "/favicon.webp" }],
  openGraph: {
    images: [
      {
        url: "https://lnkit.vercel.app/favicon.webp",
        width: 1200,
        height: 630,
        alt: "lnkit OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tanmay11117",
    title: "lnkit",
    description: "Find Your Circle",
    images: "https://lnkit.vercel.app/favicon.webp",
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
