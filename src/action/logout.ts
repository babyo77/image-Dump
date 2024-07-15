"use server";

import { cookies } from "next/headers";

export async function logout() {
  try {
    cookies().set("babyid", "", {
      expires: new Date(0),
      path: "/",
    });

    return true;
  } catch (error) {
    console.error("Error in logout:", error);
    return false;
  }
}
