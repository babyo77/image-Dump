import { getDiscover } from "@/action/getDiscover";
import { getLoggedInUser } from "@/lib/server/appwrite";
import Profile from "./profile";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Discover",
    description: "All links,one place.",
    keywords:
      "link in bio, bio link page, social media links, manage profiles, personal branding",
    icons: [{ rel: "icon", url: "/favicon.webp" }],
    openGraph: {
      title: "1nlink - Your Ultimate Bio Link Solution",
      description: "All links,one place.",
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
      description: "All links,one place.",
      images: "https://1nlink.vercel.app/favicon.webp",
    },
  };
}

async function page() {
  const discover = await getDiscover();
  const user = await getLoggedInUser();
  return (
    <Profile
      discover={
        user ? discover.filter((u) => user && u.$id !== user.$id) : discover
      }
      loggedIn={user}
    />
  );
}

export default page;
