import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { status: "failed", error: { message: "Missing 'url' query parameter" } },
      { status: 400 }
    );
  }

  try {
    const data = await fetch(`https://dub.co/api/metatags?url=${url}`, {
      next: { revalidate: 60 },
    });

    const response = await data.json();
    return NextResponse.json({ ...response, url: url });
  } catch (error) {
    return NextResponse.json(
      //@ts-expect-error:error expected
      { status: "failed", error: { message: error.message } },
      { status: 500 }
    );
  }
}
