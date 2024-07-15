"use server";
import User, { IUser } from "@/lib/models/userModel";
import dbConnect from "@/lib/server/dbConnect";
import { calculatePercentageMatching } from "@/utils/match";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "./getLogggedInUser";
import Gallery from "@/lib/models/galleryModel";
import { metadata, music } from "@/app/types/types";

export async function getUser(username: string) {
  await dbConnect();
  const [user, loggedInUser] = await Promise.all([
    User.findOne({ username: username }),
    getLoggedInUser(),
  ]);

  if (user) {
    user;
    if (loggedInUser && user.username === loggedInUser.username) {
      redirect("/p");
    }

    let music: music | null = null;
    const links: metadata[] = await Promise.all(
      user.links.map(async (link: string, id: number) => {
        const res = await fetch(`https://dub.co/api/metatags?url=${link}`, {
          next: { revalidate: 24 * 60 * 60 * 1000 },
        });
        if (!res.ok) return;
        return { ...(await res.json()), url: link, id: id };
      })
    );

    if (user.music) {
      const getMusic = await fetch(
        `https://music-player-api-mu.vercel.app/ss?s=${user.music[0]}`,
        { cache: "force-cache" }
      );
      const data = await getMusic.json();
      if (getMusic.ok) {
        music = {
          ...data[0],
          start: Number(user.music[1]),
          end: Number(user.music[2]),
        };
      }
    }

    const gallery = await Gallery.find({ userId: user._id }).limit(40);

    return {
      ...user.toObject(),
      links,
      loggedInUser,
      gallery,
      music,
      match: { per: 0 },
    } as IUser;
  }
  return null;
}
