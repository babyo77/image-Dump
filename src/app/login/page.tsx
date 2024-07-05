import { getLoggedInUser } from "@/lib/server/appwrite";
import Login from "./login";
import { redirect } from "next/navigation";

async function page() {
  const user = await getLoggedInUser();
  if (user) return redirect("/p");

  return <Login />;
}

export default page;
