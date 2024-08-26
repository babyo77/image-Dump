import { getLoggedInUser } from "@/action/getLogggedInUser";
import Gallery from "@/lib/models/galleryModel";
import Starred from "@/lib/models/starredModel";
import User from "@/lib/models/userModel";
import dbConnect from "@/lib/server/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }
    const { type, data } = await req.json();
    await dbConnect();

    let updatedUser;

    switch (type) {
      case "name":
        updatedUser = await User.findByIdAndUpdate(
          user._id,
          { name: data, fullName: data },
          { new: true }
        );
        break;
      case "star":
        updatedUser = await Starred.create({
          userId: data.userId,
          starredId: data.starredId,
        });
        break;
      case "unStar":
        updatedUser = await Starred.deleteOne({
          userId: data.userId,
          starredId: data.starredId,
        });
        break;
      case "bio":
        updatedUser = await User.findByIdAndUpdate(
          user._id,
          { bio: data },
          { new: true }
        );
        break;
      case "username":
        const containsLetters = /[a-zA-Z]/.test(data.username);

        if (!containsLetters) {
          return NextResponse.json(
            { message: "Invalid username" },
            { status: 402 }
          );
        }

        updatedUser = await User.findByIdAndUpdate(
          user._id,
          {
            username: data.username.toLowerCase().replace(/ /g, "_"),
            interests: data.interests,
          },
          { new: true }
        );
        break;
      case "links":
        updatedUser = await User.findByIdAndUpdate(
          user._id,
          { $push: { links: data } },
          { new: true }
        );
        break;
      case "remove-links":
        updatedUser = await User.findByIdAndUpdate(
          user._id,
          { links: data },
          { new: true }
        );
        break;
      case "gallery":
        updatedUser = await Gallery.create(data);
        break;
      case "music":
        updatedUser = await User.findByIdAndUpdate(
          user._id,
          { music: data },
          { new: true }
        );
        break;
      case "profile-pic":
        await fetch(user.del, { cache: "no-cache" }).catch();
        updatedUser = await User.findByIdAndUpdate(
          user._id,
          { image: data.image, del: data.del },
          { new: true }
        );
        break;
      default:
        return NextResponse.json(
          { message: "Invalid request type" },
          { status: 400 }
        );
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      { message: "Failed to update user data" },
      { status: 500 }
    );
  }
}
