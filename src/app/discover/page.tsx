import { getDiscover } from "@/action/getDiscover";
import Profile from "./p";
import { getLoggedInUser } from "@/lib/server/appwrite";

async function page() {
  const discover = await getDiscover();
  const user = await getLoggedInUser();
  return <Profile discover={discover} user={user} />;
}

export default page;
