import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = process.env.GEMINI_API;

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const formData: File | null = data.get("file") as unknown as File;
    if (!formData)
      return NextResponse.json(
        { error: { message: "no file" } },
        { status: 403 }
      );
    const bytes = await formData.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageFeatures = await run(buffer, req);
    if (JSON.parse(imageFeatures)) {
      const response = await fetch("https://api.tixte.com/v1/upload", {
        method: "POST",
        headers: {
          Authorization: process.env.UPLOAD_AUTH || "",
          "X-Api-Sitekey": process.env.SITE_KEY || "",
          "X-Window-Location": "https://tixte.com/dashboard/browse",
        },
        body: data,
      });
      const imagedata = await response.json();

      return NextResponse.json(
        {
          ...imagedata,
          status: "success",
          features: JSON.parse(imageFeatures.replace(/'/g, '"')),
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: "failed", error: { message: "Gemini Error" } },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      //@ts-expect-error:expected error
      { status: "failed", error: { message: error.message } },
      { status: 500 }
    );
  }
}

async function run(bytes: Buffer, req: NextRequest) {
  if (req.headers.get("loc") === "i") return "[]";
  try {
    const genAI = new GoogleGenerativeAI(API_KEY || "");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Extract the features of this image and provide them as an array of strings. Do not use Markdown formatting.
    
    Example:

    ["feature1", "feature2", "feature3", "feature4", "feature5"]`;

    const imageParts = [
      {
        inlineData: {
          data: Buffer.from(bytes).toString("base64"),
          mimeType: "image/jpg",
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    console.log(text);

    return text;
  } catch (error) {
    console.log(error);
    await fetch(
      `https://api.telegram.org/bot${
        process.env.TELEGRAM
      }/sendMessage?chat_id=5356614395&text=${encodeURIComponent(
        //@ts-expect-error:expected error
        error.message
      )}`
    ).catch((err) => {
      console.log(err);
    });
    return "[]";
  }
}
