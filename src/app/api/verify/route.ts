import { createAdminClient } from "@/lib/server/appwrite";
import { generateRandomUsername } from "@/lib/utils";
import { randomUUID } from "crypto";
import { User } from "firebase/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Permission, Role, Users } from "node-appwrite";

export async function POST(request: Request) {
  try {
    const userDetails: User = await request.json();

    if (!userDetails) {
      return NextResponse.json(
        { status: "failed", error: { message: "blank data" } },
        { status: 403 }
      );
    }
    if (!userDetails.email) {
      return NextResponse.json(
        { status: "failed", error: { message: "email not provided" } },
        { status: 403 }
      );
    }

    const { account, users, db } = await createAdminClient();
    const username = generateRandomUsername(userDetails.email);
    const password = randomUUID();

    const isAlreadyExist = await users.get(userDetails.uid).catch((err) => {
      console.log(err.response.message);
      return null;
    });

    if (isAlreadyExist) {
      await users.updatePassword(userDetails.uid, password);
    } else {
      const dataPromise = db.createDocument(
        process.env.DATABASE_ID || "",
        process.env.USERS_ID || "",
        userDetails.uid,
        {
          links: [`https://imagematch.com/${username}`],
          fullName: userDetails.displayName,
          bio: "",
          phoneNumber: userDetails?.phoneNumber || null,
          interests: ["Music"],
        },
        [
          Permission.read(Role.user(userDetails.uid)),
          Permission.update(Role.user(userDetails.uid)),
          Permission.delete(Role.user(userDetails.uid)),
        ]
      );

      const accountPromise = account.create(
        userDetails.uid,
        userDetails.email,
        password,
        username
      );

      const [data] = await Promise.all([dataPromise, accountPromise]);

      if (data) {
        await updatePrefs(
          users,
          userDetails.uid,
          userDetails.photoURL || "./notFound.jpg"
        );
      }
    }

    const session = await account.createEmailPasswordSession(
      userDetails.email,
      password
    );

    cookies().set("babyid", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    await fetch(
      `https://api.telegram.org/bot${
        process.env.TELEGRAM
      }/sendMessage?chat_id=5356614395&text=${encodeURIComponent(
        //@ts-expect-error: expected error
        error.message
      )}`
    ).catch((err) => {
      console.log(err);
    });
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}

async function updatePrefs(users: Users, id: string, imageUrl: string) {
  await users.updatePrefs(id, {
    image: imageUrl.replace("s91-c", "s540-c"),
  });
}
