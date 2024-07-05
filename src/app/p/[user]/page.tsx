import Footer from "@/components/ui/Footer";
import { getUser } from "@/action/getUser";
import Link from "next/link";
import { Metadata } from "next";
import Particles from "@/components/match";
import User from "./user";
import { replaceInstagramURL } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { user: string };
}): Promise<Metadata> {
  const user = await getUser(params.user);

  return {
    title: `${user?.usersDoc.fullName || "404"} (${user?.name || "404"})`,
    description: `${user?.name || ""} Link in bio`,
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
      title: `${user?.usersDoc.fullName} (${user?.name})`,
      description: `${user?.name} on lnkit`,
      images: replaceInstagramURL(user?.prefs["image"]),
    },
  };
}

export default async function page({ params }: { params: { user: string } }) {
  const user = await getUser(params.user);

  return (
    <>
      <Particles user={user} />

      {user ? (
        <>
          <User user={user} />
          <Footer loggedIn={false} user={user} />
        </>
      ) : (
        <section className="h-dvh flex justify-center items-center">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                404
              </h1>
              <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                User not found
              </p>
              <Link
                href="/"
                className="inline-flex text-zinc-400  hover:text-zinc-100  font-medium rounded-lg text-sm px-5 text-center  "
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
