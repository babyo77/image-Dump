"use server";
import { discover } from "@/app/types/types";
import User, { IUser } from "@/lib/models/userModel";
import dbConnect from "@/lib/server/dbConnect";

export async function getDiscover(mode?: "pop" | "for") {
  await dbConnect();
  const usersList: IUser[] = await User.find({}).select(
    "fullName bio _id image username"
  );

  if (mode === "pop") {
    return usersList as unknown as discover[];
  } else if (mode === "for") {
    return shuffleArray(usersList) as unknown as discover[];
  } else {
    return shuffleArray(usersList) as unknown as discover[];
  }
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
