import { createAdminClient } from "@/lib/server/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { ID, Permission, Role } from "node-appwrite";

export async function POST(req: NextRequest) {
  const { imageObj, type } = await req.json();
  const { db: database } = await createAdminClient();

  if (type === "click") {
    try {
      await database.updateDocument(
        process.env.DATABASE_ID || "",
        process.env.GALLERY_ID || "",
        imageObj.$id,
        {
          clicks: imageObj.clicks + 1,
        }
      );
      await database.createDocument(
        process.env.DATABASE_ID || "",
        process.env.ANALYTICS_ID || "",
        ID.unique(),
        {
          type: "image",
          for: imageObj.$id,
        },
        [Permission.read(Role.user(imageObj.users[0].$id))]
      );
    } catch (error) {
      return NextResponse.json(
        //@ts-expect-error:expected error
        { status: "failed", error: { message: error.message } },
        { status: 500 }
      );
    }
    return NextResponse.json({ status: "success" }, { status: 200 });
  }
  return NextResponse.json(
    { status: "failed", error: { message: "unknown type" } },
    { status: 403 }
  );
}
