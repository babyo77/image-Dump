import { getUser } from "@/action/getUser";
import { getLoggedInUser } from "@/lib/server/appwrite";
import { calculatePercentageMatching } from "@/utils/match";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json(
        { status: "failed", error: { message: "login to continue" } },
        { status: 403 }
      );
    }
    const matchWith = await getUser(username);
    if (matchWith) {
      console.log(user.prefs["interests"]);
      console.log(matchWith?.prefs["interests"]);

      const percentage = await calculatePercentageMatching(
        user.prefs["interests"],
        matchWith?.prefs["interests"]
      );
      return NextResponse.json(
        { status: "success", result: percentage },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { status: "failed", error: { message: "something went wrong" } },
      { status: 500 }
    );
  }
}
