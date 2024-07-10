"use server";
import { gallery, match, metadata, user } from "@/app/types/types";
import { createAdminClient, getLoggedInUser } from "@/lib/server/appwrite";
import { calculatePercentageMatching } from "@/utils/match";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

export async function getUser(username: string) {
  const { users, db } = await createAdminClient();
  const [userFound, loggedInUser] = await Promise.all([
    users.list([], username),
    getLoggedInUser(),
  ]);

  if (userFound.users.length === 1) {
    const data = userFound.users[0];
    if (loggedInUser && data.name === loggedInUser.name) {
      redirect("/p");
      return null;
    }

    const usersDocPromise = db.getDocument(
      process.env.DATABASE_ID || "",
      process.env.USERS_ID || "",
      data.$id,
      [Query.select(["interests", "music", "links", "fullName", "bio"])]
    );

    const galleryPromise = db.listDocuments(
      process.env.DATABASE_ID || "",
      process.env.GALLERY_ID || "",
      [
        Query.select([
          "$id",
          "data",
          "clicks",
          "link",
          "$updatedAt",
          "type",
          "features",
        ]),
        Query.equal("for", data.$id),
        Query.orderDesc("$updatedAt"),
        Query.limit(40),
      ]
    );

    const [usersDoc, gallery] = await Promise.all([
      usersDocPromise,
      galleryPromise,
    ]);
    usersDoc.gallery = gallery.documents;

    const userInterest = usersDoc.interests;

    const linksPromise = Promise.all(
      usersDoc.links.map(async (link: string, id: number) => {
        const res = await fetch(`https://dub.co/api/metatags?url=${link}`, {
          next: { revalidate: 24 * 60 * 60 * 1000 },
        });
        return { ...(await res.json()), url: link, id: id };
      })
    );

    let match: match | null = null;
    let isStarred = false;

    if (loggedInUser && loggedInUser.usersDoc.interests) {
      const starPromise = db
        .getDocument(
          process.env.DATABASE_ID || "",
          process.env.STARRED_ID || "",
          usersDoc.$id + loggedInUser.$id,
          [Query.select(["$id"])]
        )
        .catch(() => null);

      const loggedInUserGalleryPromise = db.listDocuments(
        process.env.DATABASE_ID || "",
        process.env.GALLERY_ID || "",
        [
          Query.orderDesc("$updatedAt"),
          Query.select(["features"]),
          Query.equal("for", loggedInUser.$id),
        ]
      );

      const [starDoc, loggedInUserGallery] = await Promise.all([
        starPromise,
        loggedInUserGalleryPromise,
      ]);
      isStarred = starDoc ? true : false;

      const allFeaturesOfUser = gallery.documents.flatMap(
        (item) => item.features
      );
      const allFeaturesOfLoggedInUser = loggedInUserGallery.documents.flatMap(
        (item) => item.features
      );

      match = {
        per: calculatePercentageMatching(
          [...loggedInUser.usersDoc.interests, ...allFeaturesOfLoggedInUser],
          [...userInterest, ...allFeaturesOfUser]
        ),
        image: loggedInUser.prefs["image"],
      };
    }

    if (usersDoc.music.length > 0) {
      try {
        const getMusic = await fetch(
          `https://music-player-api-mu.vercel.app/ss?s=${usersDoc.music[0]}`,
          { cache: "force-cache" }
        );
        const music = await getMusic.json();
        usersDoc.music = {
          ...music[0],
          start: Number(usersDoc.music[1]),
          end: Number(usersDoc.music[2]),
        };
      } catch (error) {
        usersDoc.music = null;
        console.log(error);
      }
    } else {
      usersDoc.music = null;
    }

    const links = await linksPromise;

    data.password = "";
    const user = {
      ...data,
      links: links,
      usersDoc,
      match: match,
      loggedInUser: loggedInUser ? loggedInUser : null,
      isStarred: isStarred,
    };

    return user as user;
  }
  return null;
}
