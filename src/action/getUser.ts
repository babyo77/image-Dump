"use server";
import { match, metadata, user, userDoc } from "@/app/types/types";
import { createAdminClient, getLoggedInUser } from "@/lib/server/appwrite";
import { calculatePercentageMatching } from "@/utils/match";
import { searchSongWithSuggestion } from "napster-info";
import { redirect } from "next/navigation";
import { ID, Permission, Query, Role } from "node-appwrite";
export async function getUser(username: string) {
  const { users, db } = await createAdminClient();
  const userFound = await users.list([Query.equal("name", username)], username);
  const loggedInUser = await getLoggedInUser();
  let match: match | null = null;
  let isStarred = false;
  if (userFound.users.length == 1) {
    const data = userFound.users[0];
    if (loggedInUser && data.name === loggedInUser.name) {
      redirect("/profile");
    }
    const usersDoc = await db.getDocument(
      process.env.DATABASE_ID || "",
      process.env.USERS_ID || "",
      data.$id
    );
    await db.updateDocument(
      process.env.DATABASE_ID || "",
      process.env.USERS_ID || "",
      data.$id,
      {
        views: usersDoc.views + 1,
      }
    );
    await db.createDocument(
      process.env.DATABASE_ID || "",
      process.env.ANALYTICS_ID || "",
      ID.unique(),
      {
        for: data.$id,
        type: "profile",
      },
      [Permission.read(Role.user(data.$id))]
    );
    const gallery = await db.listDocuments(
      process.env.DATABASE_ID || "",
      process.env.GALLERY_ID || "",
      [Query.equal("for", data.$id), Query.orderDesc("$updatedAt")]
    );
    usersDoc.gallery = gallery.documents;

    const userInterest = usersDoc.interests;

    const links: metadata[] = await Promise.all(
      usersDoc.links.map(async (link: string, id: number) => {
        const res = await fetch(`https://dub.co/api/metatags?url=${link}`, {
          next: { revalidate: 60 },
        });
        return { ...(await res.json()), url: link, id: id };
      })
    );

    if (loggedInUser && loggedInUser.usersDoc.interests) {
      try {
        const res = await db.getDocument(
          process.env.DATABASE_ID || "",
          process.env.STARRED_ID || "",
          usersDoc.$id + loggedInUser.$id
        );
        isStarred = res.$id ? true : false;
      } catch (error) {
        console.log("not starred");
      }
      match = {
        per: calculatePercentageMatching(
          loggedInUser.usersDoc.interests,
          userInterest
        ),
        image: loggedInUser.prefs["image"],
      };
    }

    if (usersDoc.music.length > 0) {
      try {
        const music = await searchSongWithSuggestion(usersDoc.music[0]);
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
