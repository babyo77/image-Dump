"use server";
import { discover, user, userDoc } from "@/app/types/types";
import { createAdminClient } from "@/lib/server/appwrite";
import { Query } from "node-appwrite";

export async function getDiscover() {
  const { db, users } = await createAdminClient();
  const usersList = await db.listDocuments(
    process.env.DATABASE_ID || "",
    process.env.USERS_ID || "",
    [
      Query.select(["fullName", "bio", "$id"]),
      Query.orderDesc("views"),
      Query.limit(70),
    ]
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

  return shuffleArrayWithPriority(newRes, "Babyo7_") as unknown as discover[];
}

function shuffleArrayWithPriority(array: any[], priorityName: string) {
  const priorityUserIndex = array.findIndex(
    (user) => user.username === priorityName
  );
  if (priorityUserIndex !== -1) {
    const priorityUser = array.splice(priorityUserIndex, 1)[0];
    const shuffledArray = shuffleArray(array);
    shuffledArray.unshift(priorityUser);
    return shuffledArray;
  }
  return shuffleArray(array);
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
