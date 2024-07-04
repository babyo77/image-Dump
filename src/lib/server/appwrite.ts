"use server";
import { Client, Account, Users, Databases, Query } from "node-appwrite";
import { cookies } from "next/headers";
import { metadata, user } from "@/app/types/types";
import { searchSongWithSuggestion } from "napster-info";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || "")
    .setProject(process.env.APPWRITE_PROJECT || "");

  const session = cookies().get("babyid");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);
  const db = new Databases(client);
  return {
    get account() {
      return new Account(client);
    },
    cookie: session,
    db,
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || "")
    .setProject(process.env.APPWRITE_PROJECT || "")
    .setKey(process.env.APPWRITE_KEY || "");
  const users = new Users(client);
  const db = new Databases(client);
  return {
    get account() {
      return new Account(client);
    },
    users,
    db,
  };
}

export async function getLoggedInUser() {
  try {
    const { account, cookie, db } = await createSessionClient();

    const data = { ...(await account.get()), cookie };

    const usersDoc = await db.getDocument(
      process.env.DATABASE_ID || "",
      process.env.USERS_ID || "",
      data.$id
    );
    const gallery = await db.listDocuments(
      process.env.DATABASE_ID || "",
      process.env.GALLERY_ID || "",
      [Query.equal("for", data.$id), Query.orderDesc("$updatedAt")]
    );
    usersDoc.gallery = gallery.documents;

    const links: metadata[] = await Promise.all(
      usersDoc.links.map(async (link: string, id: number) => {
        const res = await fetch(`https://dub.co/api/metatags?url=${link}`, {
          next: { revalidate: 60 },
        });
        return { ...(await res.json()), url: link, id: id };
      })
    );

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
    const user = { ...data, links: links, usersDoc };

    return user as user;
  } catch (error) {
    console.log(error);

    return null;
  }
}
