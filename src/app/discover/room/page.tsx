import { getLoggedInUser } from "@/action/getLogggedInUser";
import React from "react";
import Room from "./Room";

export default async function page() {
  const user = await getLoggedInUser();
  if (!user) return;
  return <Room user={user} />;
}
