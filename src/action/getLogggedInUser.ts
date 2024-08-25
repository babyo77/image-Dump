"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "../lib/server/dbConnect";
import User, { IUser } from "../lib/models/userModel";
import { metadata, music } from "@/app/types/types";
import Gallery from "@/lib/models/galleryModel";

export async function getLoggedInUser() {
  try {
    const session = cookies().get("babyid");
    if (!session || !session.value) {
      throw new Error("No session found");
    }

    const decoded: any = jwt.verify(
      session.value,
      process.env.JWT_SECRET || ""
    );
    if (!decoded || !decoded.user) {
      throw new Error("Invalid token");
    }

    await dbConnect();

    const user = await User.findById(decoded.user);
    if (!user) {
      throw new Error("User not found");
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

    const gallery = await Gallery.find({ userId: decoded.user }).limit(40);

    return JSON.parse(
      JSON.stringify({ ...user.toObject(), links, music, gallery })
    ) as IUser;
  } catch (error) {
    console.error("Error in getLoggedInUser:", error);
    return null;
  }
}
