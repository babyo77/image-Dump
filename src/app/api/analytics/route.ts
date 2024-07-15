import Gallery from "@/lib/models/galleryModel";
import dbConnect from "@/lib/server/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, _id } = await req.json();

    await dbConnect();

    const result = await Gallery.updateOne(
      { userId: _id, _id: id },
      { $inc: { clicks: 1 } }
    );
    if (result.modifiedCount === 1) {
      return NextResponse.json(
        { message: "Clicks incremented successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Gallery not found or not authorized" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error incrementing clicks:", error);
    return NextResponse.json(
      { message: "Error incrementing clicks" },
      { status: 500 }
    );
  }
}
