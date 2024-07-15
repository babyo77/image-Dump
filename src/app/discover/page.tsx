import { getDiscover } from "@/action/getDiscover";
import Profile from "./switcher";
import { Metadata } from "next";
import { getLoggedInUser } from "@/action/getLogggedInUser";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Discover",
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
      title: "Discover ",
      description: "Dump all of your images ",
      images: "https://imageDump.vercel.app/favicon.webp",
    },
  };
}

async function page() {
  const discover = await getDiscover();
  const user = await getLoggedInUser();
  return (
    <Profile
      discover={
        user ? discover.filter((u) => user && u._id !== user._id) : discover
      }
      loggedIn={user}
    />
  );
}

export default page;
