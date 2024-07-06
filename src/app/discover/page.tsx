import { getDiscover } from "@/action/getDiscover";
import { getLoggedInUser } from "@/lib/server/appwrite";
import Profile from "./profile";

async function page() {
  const discover = await getDiscover();
  const user = await getLoggedInUser();
  return (
    <Profile
      discover={
        user ? discover.filter((u) => user && u.$id !== user.$id) : discover
      }
      user={user}
    />
  );
}

export default page;
