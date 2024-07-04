import { getLoggedInUser } from "@/lib/server/appwrite";
import Login from "./login";
import { redirect } from "next/navigation";

async function page() {
  const user = await getLoggedInUser();
  if (user) return redirect("/profile");

  return <Login />;
}

export default page;
