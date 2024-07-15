import User from "@/lib/models/userModel";
import dbConnect from "@/lib/server/dbConnect";
import { generateRandomUsername } from "@/lib/utils";
import { User as userType } from "firebase/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
const jwt_secret = process.env.JWT_SECRET || "";
export async function POST(request: Request) {
  try {
    const userDetails: userType = await request.json();

    if (!userDetails) {
      return NextResponse.json(
        { status: "failed", error: { message: "blank data" } },
        { status: 403 }
      );
    }
    await dbConnect();
    const user = await User.findOne({ email: userDetails.email });
    if (user) {
      proceed(user);
      return NextResponse.json({ status: "success" }, { status: 200 });
    }
    const newUser = new User({
      email: userDetails.email,
      name: userDetails.displayName,
      fullName: userDetails.displayName,
      phoneNumber: userDetails.phoneNumber,
      username: generateRandomUsername(userDetails.email || "random@gamil.com"),
      image: userDetails.photoURL,
      del: "https://example.com",
      interests: ["music", "chill"],
    });
    const saved: Document = await newUser.save();
    proceed(saved);
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}

const proceed = (saved: Document) => {
  const accessToken = jwt.sign({ user: saved._id }, jwt_secret, {
    expiresIn: "7d",
  });

  cookies().set("babyid", accessToken, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
};
