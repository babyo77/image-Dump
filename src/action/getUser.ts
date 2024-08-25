"use server";
import User, { IUser } from "@/lib/models/userModel";
import dbConnect from "@/lib/server/dbConnect";
import { calculatePercentageMatching } from "@/utils/match";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "./getLogggedInUser";
import Gallery from "@/lib/models/galleryModel";
import { metadata, music } from "@/app/types/types";
import Starred from "@/lib/models/starredModel";

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
    user.links = user.links.filter((r: string) => r.trim() !== "");
    user.image = user.image.replace("s96", "s1440");
    const links: metadata[] = await Promise.all(
      user.links.map(async (link: string, id: number) => {
        const res = await fetch(`https://dub.co/api/metatags?url=${link}`, {
          next: { revalidate: 24 * 60 * 60 * 1000 },
        });
        if (!res.ok) return;
        const data = await res.json();
        return { ...data, url: link, id: id };
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

    const gallery = await Gallery.find({ userId: user._id })
      .sort({ updatedAt: -1 })
      .limit(40);

    const isStarred = await Starred.findOne({
      userId: loggedInUser?._id,
      starredId: user.id,
    });

    return JSON.parse(
      JSON.stringify({
        ...user.toObject(),
        links,
        loggedInUser,
        gallery,
        isStarred: isStarred ? true : false,
        music,
        match: { per: 0 },
      })
    ) as IUser;
  }
  return null;
}
