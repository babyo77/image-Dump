import { getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await getLoggedInUser();

  if (user) return redirect(`/p/${user.name}`);

  return redirect("/discover");
}
