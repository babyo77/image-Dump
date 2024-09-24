import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const formData: File | null = data.get("file") as unknown as File;
    const fileSizeMB = formData.size / (1024 * 1024);

    if (
      !formData.type.startsWith("audio") &&
      !formData.type.startsWith("image")
    ) {
      return NextResponse.json(
        { status: "failed", error: { message: "invalid format" } },
        { status: 400 }
      );
    }
    if (fileSizeMB > 20) {
      return NextResponse.json(
        { status: "failed", error: { message: "File size exceeds 20MB" } },
        { status: 400 }
      );
    }
    if (!formData)
      return NextResponse.json(
        { error: { message: "no file" } },
        { status: 400 }
      );
    const response = await fetch("https://api.tixte.com/v1/upload", {
      method: "POST",
      headers: {
        Authorization: process.env.UPLOAD_AUTH || "",
        "X-Api-Sitekey": process.env.SITE_KEY || "",
        "X-Window-Location": "https://tixte.com/dashboard/browse",
      },
      body: data,
    });
    if (!response.ok) throw new Error("Missing permission");
    const imagedata = await response.json();

    return NextResponse.json(
      {
        ...imagedata,
        status: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      //@ts-expect-error:expected error
      { status: "failed", error: { message: error.message } },
      { status: 500 }
    );
  }
}
