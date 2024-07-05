import Footer from "@/components/ui/Footer";
import { getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import Details from "./details";
import { Metadata } from "next";
import { replaceInstagramURL } from "@/lib/utils";
import AnimatedInterests from "./loggedIn";
import Gallery from "./gallery";
import { Dot } from "lucide-react";
import { MdOutlinePlayCircle } from "react-icons/md";
import Music from "./music";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getLoggedInUser();

  return {
    title: `${user?.usersDoc.fullName} | Profile`,
    description: `${user?.name} on circles`,
    icons: [
      {
        rel: "icon",
        url: replaceInstagramURL(user?.prefs["image"]),
      },
    ],
    openGraph: {
      images: [
        {
          url: replaceInstagramURL(user?.prefs["image"]),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@tanmay11117",
      title: `${user?.usersDoc.fullName} | Profile`,
      description: `${user?.name} on circles`,
      images: replaceInstagramURL(user?.prefs["image"]),
    },
  };
}

export default async function page() {
  const user = await getLoggedInUser();

  if (!user) return redirect("/login");

  return (
    <>
      {/* <Interests className="hidden" user={user} /> */}
      <div className=" px-5 w-full pt-11 flex pb-24 justify-start items-start">
        <div className="  cursor-pointer absolute  flex-col items-center gap-2.5 hover:text-zinc-300 transition-all right-4 duration-300">
          <AnimatedInterests user={user} />
        </div>
        <div className=" gap-5 flex flex-col w-full">
          <Details details={user} />
          {user.usersDoc.music && <Music user={user} />}
          {/* <div className=" flex gap-2 overflow-scroll no-scrollbar">
            <p className=" p-2 px-4 rounded-full bg-zinc-100 text-black w-fit text-xs">
              #Wallpaper
            </p>
            <p className=" p-2 px-4 rounded-full bg-zinc-800 w-fit text-xs">
              #Wallpaper
            </p>
            <p className=" p-2 px-4 rounded-full bg-zinc-800 w-fit text-xs">
              #Wallpaper
            </p>
            <p className=" p-2 px-4 rounded-full bg-zinc-800 w-fit text-xs">
              #Wallpaper
            </p>
          </div> */}
          <Gallery user={user} remove />
        </div>
      </div>
      <Footer loggedIn={user ? true : false} user={user} />
    </>
  );
}
