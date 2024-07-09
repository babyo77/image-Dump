import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  params: { params: { ip: string } }
) {
  try {
    const ip = params.params.ip;
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    if (data.country) {
      return NextResponse.json({ country: data.country }, { status: 200 });
    } else {
      throw new Error("invalid query");
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 }
    );
  }
}
