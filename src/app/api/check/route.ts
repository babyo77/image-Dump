import { createAdminClient, getLoggedInUser } from "@/lib/server/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams;
    const username = search.get("u");

    if (!username) {
      return NextResponse.json(
        { user: "missing username parameter" },
        { status: 400 }
      );
    }

    const [adminClient, loggedInUser] = await Promise.all([
      createAdminClient(),
      getLoggedInUser(),
    ]);

    if (!loggedInUser) {
      return NextResponse.json({ user: "not logged in" }, { status: 403 });
    }

    const userFound = await adminClient.users.list([
      Query.equal("name", username),
    ]);

    if (userFound.total > 0 && loggedInUser.name !== userFound.users[0].name) {
      return NextResponse.json({ user: true }, { status: 200 });
    } else {
      return NextResponse.json({ user: false }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
