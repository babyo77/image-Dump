import { getLoggedInUser } from "@/action/getLogggedInUser";
import Gallery from "@/lib/models/galleryModel";
import dbConnect from "@/lib/server/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await req.json();

    await dbConnect();

    const result = await Gallery.deleteOne({ userId: user._id, _id: id });
    if (result.deletedCount === 1) {
      return NextResponse.json(
        { message: "Gallery deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Gallery not found or not authorized" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return NextResponse.json(
      { message: "Error deleting gallery" },
      { status: 500 }
    );
  }
}
