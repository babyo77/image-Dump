import { createAdminClient, getLoggedInUser } from "@/lib/server/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams;
    const username = search.get("u");
    const { users } = await createAdminClient();
    const user = await getLoggedInUser();
    if (username && user) {
      const userFound = await users.list(
        [Query.equal("name", username)],
        username
      );
      if (userFound.total > 0 && user.name !== userFound.users[0].name) {
        return NextResponse.json({ user: true }, { status: 200 });
      } else {
        return NextResponse.json({ user: false }, { status: 404 });
      }
    } else {
      return NextResponse.json({ user: "not logged in" }, { status: 403 });
    }
  } catch (error) {
    //@ts-expect-error:expected error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
