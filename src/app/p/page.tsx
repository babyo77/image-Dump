import Footer from "@/components/ui/Footer";
import { getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import Details from "./details";
import { Metadata } from "next";
import { replaceInstagramURL } from "@/lib/utils";
import AnimatedInterests from "./loggedIn";
import Gallery from "./gallery";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getLoggedInUser();

  return {
    title: `${user?.usersDoc.fullName} | Profile`,
    description: `Do we have similar taste?`,
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
      description: `${user?.name} on imageDump`,
      images: replaceInstagramURL(user?.prefs["image"]),
    },
  };
}

export default async function page() {
  const user = await getLoggedInUser();

  if (!user) return redirect("/login");

  return (
    <>
      <div className=" px-7 w-full pt-11 flex pb-24 justify-start items-start">
        <div className="  cursor-pointer absolute  flex-col items-center gap-2.5 hover:text-zinc-300 transition-all right-4 duration-300">
          <AnimatedInterests user={user} />
        </div>
        <div className=" gap-5 flex flex-col w-full">
          <Details details={user} />
          <Gallery user={user} remove />
        </div>
      </div>
      <Footer loggedIn={user ? true : false} user={user} />
    </>
  );
}
