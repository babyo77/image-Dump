import { getLoggedInUser } from "@/action/getLogggedInUser";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await getLoggedInUser();

  if (user) return redirect(`/p/${user.username}`);

  return redirect("/discover");
}
