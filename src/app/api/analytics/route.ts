import { createAdminClient } from "@/lib/server/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { ID, Permission, Role } from "node-appwrite";

export async function POST(req: NextRequest) {
  const { id, user, type, c, v } = await req.json();
  const { db: database } = await createAdminClient();

  if (type === "profile") {
    try {
      await database.updateDocument(
        process.env.DATABASE_ID || "",
        process.env.USERS_ID || "",
        id,
        {
          views: v + 1,
        }
      );
      await database.createDocument(
        process.env.DATABASE_ID || "",
        process.env.ANALYTICS_ID || "",
        ID.unique(),
        {
          for: id,
          type: "profile",
        },
        [Permission.read(Role.user(id))]
      );
      return NextResponse.json({ status: "success" }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        //@ts-expect-error:expected error
        { status: "failed", error: { message: error.message } },
        { status: 500 }
      );
    }
  }
  if (type === "click") {
    try {
      await database.updateDocument(
        process.env.DATABASE_ID || "",
        process.env.GALLERY_ID || "",
        id,
        {
          clicks: c + 1,
        }
      );
      await database.createDocument(
        process.env.DATABASE_ID || "",
        process.env.ANALYTICS_ID || "",
        ID.unique(),
        {
          type: "image",
          for: id,
        },
        [Permission.read(Role.user(user))]
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
