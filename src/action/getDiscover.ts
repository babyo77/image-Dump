"use server";
import { discover } from "@/app/types/types";
import { createAdminClient } from "@/lib/server/appwrite";
import { Query } from "node-appwrite";

export async function getDiscover(mode?: "pop" | "for") {
  const { db, users } = await createAdminClient();
  const usersList = await db.listDocuments(
    process.env.DATABASE_ID || "",
    process.env.USERS_ID || "",
    [Query.select(["fullName", "bio", "$id"]), Query.orderDesc("views")]
  );

  const newRes = await Promise.all(
    usersList.documents.map(async (doc) => {
      const user = await users.get(doc.$id);
      return {
        ...doc,
        image: user.prefs["image"],
        username: user.name,
      };
    })
  );
  if (mode === "pop") {
    return newRes as unknown as discover[];
  } else if (mode === "for") {
    return shuffleArray(newRes) as unknown as discover[];
  } else {
    return shuffleArray(newRes) as unknown as discover[];
  }
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
